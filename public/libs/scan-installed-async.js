const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const electron = require('electron');

const getAllAppPath = require('./get-all-app-path');
const uninstallAppAsync = require('./uninstall-app-async');
const sendMessageToWindow = require('./send-message-to-window');

const scanInstalledAsync = () =>
  Promise.resolve()
    .then(() => {
      const allAppPath = getAllAppPath();

      const installedApps = [];

      switch (os.platform()) {
        case 'darwin': {
          return fs.readdir(allAppPath)
            .then((files) => {
              const promises = [];

              files.forEach((fileName) => {
                if (fileName === '.DS_Store') return;

                const infoPath = path.join(allAppPath, fileName, 'Contents', 'Resources', 'info.json');

                promises.push(
                  fs.pathExists(infoPath)
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
                    }),
                );

                const packageJsonPath = path.join(allAppPath, fileName, 'Contents', 'Resources', 'app.asar.unpacked', 'package.json');
                promises.push(
                  fs.pathExists(packageJsonPath)
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
                    }),
                );
              });

              return Promise.all(promises)
                .then(() => installedApps);
            });
        }
        case 'linux': {
          return fs.readdir(allAppPath)
            .then((err, files) => {
              files.forEach((fileName) => {
                if (!fileName.startsWith('webcatalog-')) return;

                const appInfo = JSON.parse(fs.readFileSync(path.join(allAppPath, fileName), 'utf8').split('\n')[1].substr(1));

                installedApps.push(appInfo);
              });

              return installedApps;
            });
        }
        case 'win32':
        default: {
          const p = [];

          // >= 7.0.0
          p.push(
            fs.readdir(allAppPath)
              .then((files) => {
                const promises = [];

                files.forEach((fileName) => {
                  const packageJsonPath = path.join(allAppPath, fileName, 'resources', 'app.asar.unpacked', 'package.json');
                  promises.push(
                    fs.pathExists(packageJsonPath)
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
                      }),
                  );
                });

                return Promise.all(promises);
              }),
          );

          // legacy, v < 7.0.0
          const legacyAllAppPath = path.join(electron.app.getPath('home'), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps');
          p.push(
            fs.pathExists(legacyAllAppPath)
              .then((exists) => {
                if (exists) {
                  return fs.readdir(legacyAllAppPath)
                    .then((files) => {
                      if (files.length === 0) return null;

                      return new Promise((resolve, reject) => {
                        let i = 0;
                        files.forEach((fileName) => {
                          /* eslint-disable */
                          const WindowsShortcuts = require('windows-shortcuts');
                          /* eslint-enable */
                          WindowsShortcuts.query(path.join(legacyAllAppPath, fileName),
                            (wsShortcutErr, { desc }) => {
                              if (wsShortcutErr) {
                                reject(wsShortcutErr);
                              } else {
                                try {
                                  const appInfo = JSON.parse(desc);
                                  installedApps.push(appInfo);
                                } catch (jsonErr) {
                                  /* eslint-disable no-console */
                                  sendMessageToWindow('log', `Failed to parse file ${fileName}`);
                                  /* eslint-enable no-console */
                                }
                              }

                              i += 1;
                              if (i === files.length) resolve();
                            });
                        });
                      });
                    });
                }
                return null;
              }),
          );

          return Promise.all(p)
            .then(() => installedApps);
        }
      }
    })
    .then(installedApps => installedApps.filter((app) => {
      // without shellVersion or moleculeVersion,
      // it means the app is outdated and should be deleted.
      if (!app.shellVersion && !app.moleculeVersion) {
        uninstallAppAsync(
          app.id,
          app.name,
          { shouldClearStorageData: true });

        return false;
      }

      return true;
    }));

module.exports = scanInstalledAsync;
