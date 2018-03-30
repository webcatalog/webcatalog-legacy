const path = require('path');
const fs = require('fs-extra');

const getInstallationPath = require('./get-installation-path');
const removeOldVersionsAsync = require('./remove-old-versions-async');

const scanInstalledAsync = () =>
  Promise.resolve()
    .then(() => {
      const allAppPath = getInstallationPath();

      const installedApps = [];

      return fs.pathExists(allAppPath)
        .then((allAppPathExists) => {
          if (allAppPathExists) {
            return fs.readdir(allAppPath)
              .then((files) => {
                const promises = [];

                files.forEach((fileName) => {
                  if (fileName === '.DS_Store') return;

                  const packageJsonPath = process.platform === 'darwin' ?
                    path.join(allAppPath, fileName, 'Contents', 'Resources', 'app.asar.unpacked', 'package.json')
                    : path.join(allAppPath, fileName, 'resources', 'app.asar.unpacked', 'package.json');
                  const iconPath = process.platform === 'darwin' ?
                    path.join(allAppPath, fileName, 'Contents', 'Resources', 'icon.png')
                    : path.join(allAppPath, fileName, 'resources', 'icon.png');

                  promises.push(fs.pathExists(packageJsonPath)
                    .then((exists) => {
                      if (exists) {
                        return fs.readJson(packageJsonPath)
                          .then((packageInfo) => {
                            const appInfo = Object.assign({}, packageInfo.webApp, {
                              moleculeVersion: packageInfo.version,
                              icon: fs.pathExistsSync(iconPath) ? iconPath : null,
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

          return null;
        })
        .then(() => installedApps);
    })
    .then((installedApps) => {
      removeOldVersionsAsync(installedApps);

      return installedApps;
    });

module.exports = scanInstalledAsync;
