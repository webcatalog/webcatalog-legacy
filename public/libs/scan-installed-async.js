const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const { app, shell } = require('electron');

const getAllAppPath = require('./get-all-app-path');
const removeOldVersionsAsync = require('./remove-old-versions-async');
const sendMessageToWindow = require('./send-message-to-window');
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
          const p = [];

          // > 7.0.0
          p.push(fs.pathExists(allAppPath)
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
            }));

          // legacy, v < 7.0.0
          const legacyAllAppPath = path.join(app.getPath('home'), '.local', 'share', 'applications');
          p.push(fs.pathExists(legacyAllAppPath)
            .then((exists) => {
              if (exists) {
                return fs.readdir(allAppPath)
                  .then((files) => {
                    files.forEach((fileName) => {
                      if (!fileName.startsWith('webcatalog-')) return;

                      try {
                        const appInfo = JSON.parse(fs.readFileSync(path.join(allAppPath, fileName), 'utf8').split('\n')[1].substr(1));

                        installedApps.push(appInfo);
                      } catch (err) {
                        sendMessageToWindow('log', err);
                      }
                    });

                    return installedApps;
                  });
              }

              return [];
            }));

          return Promise.all(p)
            .then(() => installedApps);
        }
        case 'win32':
        default: {
          const p = [];

          // >= 7.0.0
          p.push(fs.pathExists(allAppPath)
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
            }));

          // legacy, v < 7.0.0
          const legacyAllAppPath = path.join(app.getPath('home'), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps');
          p.push(fs.pathExists(legacyAllAppPath)
            .then((exists) => {
              if (exists) {
                return fs.readdir(legacyAllAppPath)
                  .then((files) => {
                    if (files.length === 0) return;

                    files.forEach((fileName) => {
                      const fullPath = path.join(legacyAllAppPath, fileName);
                      const shortcutDetails = shell.readShortcutLink(fullPath);
                      const { description } = shortcutDetails;

                      try {
                        const appInfo = JSON.parse(description);
                        installedApps.push(appInfo);
                      } catch (jsonErr) {
                        /* eslint-disable no-console */
                        sendMessageToWindow('log', `Failed to parse file ${fileName}`);
                        /* eslint-enable no-console */
                      }
                    });
                  });
              }
              return [];
            }));

          return Promise.all(p)
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
