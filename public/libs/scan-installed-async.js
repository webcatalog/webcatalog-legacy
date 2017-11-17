const os = require('os');
const path = require('path');
const fs = require('fs-extra');

const getAllAppPath = require('./get-all-app-path');
const removeOldVersionsAsync = require('./remove-old-versions-async');
const uninstallAppAsync = require('./uninstall-app-async');

const scanInstalledAsync = () =>
  Promise.resolve()
    .then(() => {
      const allAppPath = getAllAppPath();

      const installedApps = [];

      switch (os.platform()) {
        case 'darwin': {
          return fs.pathExists(allAppPath)
            .then((allAppPathExists) => {
              if (allAppPathExists) {
                return fs.readdir(allAppPath)
                  .then((files) => {
                    const promises = [];

                    files.forEach((fileName) => {
                      if (fileName === '.DS_Store') return;

                      const infoPath = path.join(allAppPath, fileName, 'Contents', 'Resources', 'info.json');

                      promises.push(fs.pathExists(infoPath)
                        .then((exists) => {
                          if (exists) {
                            return fs.readJson(infoPath)
                              .then((info) => {
                                const appInfo = Object.assign({}, info, {
                                  moleculeVersion: '0.0.0',
                                });
                                installedApps.push(appInfo);
                              });
                          }
                          return null;
                        }));

                      const packageJsonPath = path.join(allAppPath, fileName, 'Contents', 'Resources', 'app.asar.unpacked', 'package.json');
                      promises.push(fs.pathExists(packageJsonPath)
                        .then((exists) => {
                          if (exists) {
                            return fs.readJson(packageJsonPath)
                              .then((packageInfo) => {
                                const appInfo = Object.assign({}, packageInfo.webApp, {
                                  moleculeVersion: packageInfo.version,
                                });

                                installedApps.push(appInfo);
                              });
                          }
                          return null;
                        }));
                    });

                    return Promise.all(promises)
                      .then(() => installedApps);
                  });
              }

              return [];
            });
        }
        case 'linux': {
          return fs.pathExists(allAppPath)
            .then((allAppPathExists) => {
              if (allAppPathExists) {
                return fs.readdir(allAppPath)
                  .then((files) => {
                    const promises = [];

                    files.forEach((fileName) => {
                      const packageJsonPath = path.join(allAppPath, fileName, 'resources', 'app.asar.unpacked', 'package.json');
                      promises.push(fs.pathExists(packageJsonPath)
                        .then((exists) => {
                          if (exists) {
                            return fs.readJson(packageJsonPath)
                              .then((packageInfo) => {
                                const appInfo = Object.assign({}, packageInfo.webApp, {
                                  moleculeVersion: packageInfo.version,
                                });

                                installedApps.push(appInfo);
                              });
                          }
                          return null;
                        }));
                    });

                    return Promise.all(promises);
                  });
              }

              return [];
            })
            .then(() => installedApps);
        }
        case 'win32':
        default: {
          // >= 7.0.0
          return fs.pathExists(allAppPath)
            .then((allAppPathExists) => {
              if (allAppPathExists) {
                return fs.readdir(allAppPath)
                  .then((files) => {
                    const promises = [];

                    files.forEach((fileName) => {
                      const packageJsonPath = path.join(allAppPath, fileName, 'resources', 'app.asar.unpacked', 'package.json');
                      promises.push(fs.pathExists(packageJsonPath)
                        .then((exists) => {
                          if (exists) {
                            return fs.readJson(packageJsonPath)
                              .then((packageInfo) => {
                                const appInfo = Object.assign({}, packageInfo.webApp, {
                                  moleculeVersion: packageInfo.version,
                                });

                                installedApps.push(appInfo);
                              });
                          }
                          return null;
                        }));
                    });

                    return Promise.all(promises);
                  });
              }

              return null;
            })
            .then(() => installedApps);
        }
      }
    })
    .then(installedApps => installedApps.filter((a) => {
      // without shellVersion or moleculeVersion,
      // it means the app is outdated and should be deleted.
      if (!a.shellVersion && !a.moleculeVersion) {
        uninstallAppAsync(a.id, a.name)
        // eslint-disable-next-line no-console
          .catch(console.log);

        return false;
      }

      return true;
    }))
    .then((installedApps) => {
      removeOldVersionsAsync(installedApps);

      return installedApps;
    });

module.exports = scanInstalledAsync;
