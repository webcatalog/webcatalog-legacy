import { remote } from 'electron';

import getAllAppPath from './getAllAppPath';
import uninstallAppAsync from './uninstallAppAsync';

const scanInstalledAsync = () =>
  new Promise((resolve, reject) => {
    const os = remote.require('os');
    const path = remote.require('path');
    const fs = remote.require('fs');

    const allAppPath = getAllAppPath();

    const installedApps = [];

    switch (os.platform()) {
      case 'darwin': {
        remote.require('fs').readdir(allAppPath, (err, files) => {
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
            const WindowsShortcuts = remote.require('windows-shortcuts');
            WindowsShortcuts.query(path.join(allAppPath, fileName), (wsShortcutErr, { desc }) => {
              if (wsShortcutErr) {
                reject(wsShortcutErr);
              } else {
                const appInfo = JSON.parse(desc);
                installedApps.push(appInfo);
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
      uninstallAppAsync({
        appId: app.id,
        appName: app.name,
        shouldClearStorageData: true,
      });

      return false;
    }

    return true;
  }));

export default scanInstalledAsync;
