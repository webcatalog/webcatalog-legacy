const path = require('path');
const fs = require('fs-extra');

const getInstallationPath = require('./get-installation-path');

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

                  const packageJsonPath = path.join(allAppPath, fileName, 'Contents', 'Resources', 'app.asar.unpacked', 'package.json');
                  const iconPath = path.join(allAppPath, fileName, 'Contents', 'Resources', 'icon.png');

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
    });

module.exports = scanInstalledAsync;
