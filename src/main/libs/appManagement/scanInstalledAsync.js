const os = require('os');
const path = require('path');
const fs = require('fs');

const getAllAppPath = require('./getAllAppPath');
const uninstallAppAsync = require('./uninstallAppAsync');
const sendMessageToWindow = require('../sendMessageToWindow');

const scanInstalledAsync = () =>
  new Promise((resolve, reject) => {
    const allAppPath = getAllAppPath();

    const installedApps = [];

    switch (os.platform()) {
      case 'darwin': {
        fs.readdir(allAppPath, (err, files) => {
          if (err) {
            reject(err);
            return;
          }

          files.forEach((fileName) => {
            if (fileName === '.DS_Store') return;

            const infoPath = path.join(allAppPath, fileName, 'Contents', 'Resources', 'info.json');
            const appInfo = JSON.parse(fs.readFileSync(infoPath, 'utf8'));

            installedApps.push(appInfo);
          });

          resolve(installedApps);
        });
        break;
      }
      case 'linux': {
        fs.readdir(allAppPath, (err, files) => {
          if (err) {
            reject(err);
            return;
          }

          files.forEach((fileName) => {
            if (!fileName.startsWith('webcatalog-')) return;

            const appInfo = JSON.parse(fs.readFileSync(path.join(allAppPath, fileName), 'utf8').split('\n')[1].substr(1));

            installedApps.push(appInfo);
          });
          resolve(installedApps);
        });
        break;
      }
      case 'win32':
      default: {
        fs.readdir(allAppPath, (err, files) => {
          if (err) {
            reject(err);
            return;
          }

          let i = 0;

          if (files.length === 0) resolve(installedApps);

          files.forEach((fileName) => {
            /* eslint-disable */
            const WindowsShortcuts = require('windows-shortcuts');
            /* eslint-enable */
            WindowsShortcuts.query(path.join(allAppPath, fileName), (wsShortcutErr, { desc }) => {
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
              if (i === files.length) resolve(installedApps);
            });
          });
        });
      }
    }
  })
  // uninstall < 5.0 apps
  .then(installedApps => installedApps.filter((app) => {
    if (!app.shellVersion) {
      uninstallAppAsync(
        app.id,
        app.name,
        { shouldClearStorageData: true },
      );

      return false;
    }

    return true;
  }));

module.exports = scanInstalledAsync;
