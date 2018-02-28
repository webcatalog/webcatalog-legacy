const path = require('path');
const fs = require('fs-extra');
const { app } = require('electron');

const getInstallationPath = require('./get-installation-path');

const allAppPath = getInstallationPath();

const scanInstalledAsync = () =>
  Promise.resolve()
    .then(() => {
      const installedApps = [];

      return fs.pathExists(allAppPath)
        .then((allAppPathExists) => {
          if (allAppPathExists) {
            return fs.readdir(allAppPath)
              .then((files) => {
                const promises = [];

                if (process.platform === 'darwin') {
                  files.forEach((fileName) => {
                    if (fileName === '.DS_Store') return;

                    const bashPath = path.join(allAppPath, fileName, 'Contents', 'MacOS', 'Executable');
                    const iconPath = path.join(allAppPath, fileName, 'Contents', 'Resources', 'app.png');

                    promises.push(fs.pathExists(bashPath)
                      .then((exists) => {
                        if (exists) {
                          return fs.readFile(bashPath, 'utf8')
                            .then((bashScript) => {
                              const lines = bashScript.split('\n');
                              const appInfo = {
                                name: lines[2].substr(1),
                                url: lines[3].substr(1),
                                id: lines[4].substr(1),
                                icon: iconPath,
                              };

                              installedApps.push(appInfo);
                            });
                        }
                        return null;
                      }).catch(() => {}));
                  });
                }

                if (process.platform === 'linux') {
                  files.forEach((fileName) => {
                    if (fileName === '.DS_Store') return;
                    if (!fileName.startsWith('webcatalog-')) return;

                    const bashPath = path.join(allAppPath, fileName);

                    promises.push(fs.readFile(bashPath, 'utf8')
                      .then((bashScript) => {
                        const lines = bashScript.split('\n');

                        const appInfo = {
                          name: lines[2].substr(1),
                          url: lines[3].substr(1),
                          id: lines[4].substr(1),
                          icon: path.join(app.getPath('home'), '.local', 'share', 'icons', `webcatalog-${lines[4].substr(1)}`),
                        };

                        installedApps.push(appInfo);
                      }).catch(() => {}));
                  });
                }


                return Promise.all(promises)
                  .then(() => installedApps);
              });
          }

          return null;
        })
        .then(() => installedApps);
    });

module.exports = scanInstalledAsync;
