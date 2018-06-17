const path = require('path');
const fs = require('fs-extra');
const { app } = require('electron');
const ws = require('windows-shortcuts');

const getInstallationPath = require('./get-installation-path');

const allAppPath = getInstallationPath();

const queryShortcutAsync = shortcutPath =>
  new Promise((resolve, reject) => {
    ws.query(shortcutPath, (err, shortcutDetails) => {
      if (err) { return reject(err); }
      return resolve(shortcutDetails);
    });
  });

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

                if (process.platform === 'win32') {
                  files.forEach((fileName) => {
                    if (fileName.endsWith('.lnk')) {
                      const shortcutPath = path.join(allAppPath, fileName);

                      promises.push(queryShortcutAsync(shortcutPath)
                        .then((shortcutDetails) => {
                          const appObj = JSON.parse(shortcutDetails.desc);
                          installedApps.push({
                            id: appObj.id,
                            name: appObj.name,
                            url: appObj.url,
                            icon: path.join(app.getPath('home'), '.webcatalog', 'icons', `${appObj.id}.png`),
                          });
                        }));
                    }
                  });
                }

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
                          icon: path.join(app.getPath('home'), '.local', 'share', 'icons', `webcatalog-${lines[4].substr(1)}.png`),
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
