import { remote } from 'electron';

const scanInstalledAsync = ({ allAppPath }) =>
  new Promise((resolve, reject) => {
    const os = remote.require('os');
    const path = remote.require('path');
    const fs = remote.require('fs');

    const installedIds = [];

    switch (os.platform()) {
      case 'darwin': {
        remote.require('fs').readdir(allAppPath, (err, files) => {
          if (err) {
            reject(err);
            return;
          }

          files.forEach((fileName) => {
            if (fileName === '.DS_Store') return;

            // if id file exists, the .app needs to be updated
            const idPath = path.join(allAppPath, fileName, 'id');
            let appId;
            if (fs.existsSync(idPath)) {
              appId = fs.readFileSync(idPath, 'utf8').trim();
              installedIds.push({
                version: '3.1.1',
                id: appId,
              });
            } else {
              const infoPath = path.join(allAppPath, fileName, 'Contents', 'Resources', 'info.json');
              const appInfo = JSON.parse(fs.readFileSync(infoPath, 'utf8'));

              installedIds.push({
                id: appInfo.id,
                version: appInfo.version,
                name: appInfo.name,
                url: appInfo.url,
              });
            }
          });
          resolve(installedIds);
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

            const appInfo = fs.readFileSync(path.join(allAppPath, fileName), 'utf8').split('\n')[1].substr(1);

            installedIds.push(appInfo);
          });
          resolve(installedIds);
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

          if (files.length === 0) resolve(installedIds);

          files.forEach((fileName) => {
            const WindowsShortcuts = remote.require('windows-shortcuts');
            WindowsShortcuts.query(path.join(allAppPath, fileName), (wsShortcutErr, { desc }) => {
              if (wsShortcutErr) {
                reject(wsShortcutErr);
              } else {
                let id;
                let name;
                let url;
                let version = '3.1.1';
                // only from 3.2, WebCatalog starts using JSON
                try {
                  const appInfo = JSON.parse(desc);
                  id = appInfo.id;
                  version = appInfo.version;
                  name = appInfo.name;
                  url = appInfo.url;
                } catch (jsonErr) {
                  /* eslint-disable no-console */
                  console.log(jsonErr);
                  /* eslint-enable no-console */
                  id = desc;
                }
                installedIds.push({ id, version, name, url });
              }

              i += 1;
              if (i === files.length) resolve(installedIds);
            });
          });
        });
      }
    }
  });

export default scanInstalledAsync;
