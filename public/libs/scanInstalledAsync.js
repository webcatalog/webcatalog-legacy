const os = require('os');
const path = require('path');
const fs = require('fs-extra');

const getAllAppPath = require('./getAllAppPath');
const uninstallAppAsync = require('./uninstallAppAsync');

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

                const packageJsonPath = path.join(allAppPath, fileName, 'Contents', 'Resources', 'app', 'package.json');
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
          return installedApps;
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
