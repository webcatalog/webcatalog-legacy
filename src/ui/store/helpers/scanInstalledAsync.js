/* global fs WindowsShortcuts https os execFile remote mkdirp */

const scanInstalledAsync = ({ allAppPath }) =>
  new Promise((resolve, reject) => {
    const installedIds = [];

    switch (os.platform()) {
      case 'darwin': {
        fs.readdir(allAppPath, (err, files) => {
          if (err) {
            reject(err);
            return;
          }

          files.forEach((fileName) => {
            if (fileName === '.DS_Store') return;

            // if id file exists, the .app needs to be updated
            const idPath = `${allAppPath}/${fileName}/id`;
            let appId;
            if (fs.existsSync(idPath)) {
              appId = fs.readFileSync(idPath, 'utf8').trim();
              installedIds.push({
                version: '3.1.1',
                id: appId,
              });
            } else {
              const infoPath = `${allAppPath}/${fileName}/Contents/Resources/info.json`;
              const appInfo = JSON.parse(fs.readFileSync(infoPath, 'utf8'));

              installedIds.push({
                id: appInfo.id,
                version: appInfo.version,
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
            const id = fileName.replace('.desktop', '').trim();

            let version = '3.1.1';
            try {
              const jsonContent = fs.readFileSync(`${allAppPath}/${fileName}`, 'utf8').split('\n')[1].splice(1);
              const appInfo = JSON.parse(jsonContent);
              version = appInfo.version;
            } catch (jsonErr) {
              /* eslint-disable no-console */
              console.log(jsonErr);
              /* eslint-enable no-console */
            }

            installedIds.push({ id, version });
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
            WindowsShortcuts.query(`${allAppPath}/${fileName}`, (wsShortcutErr, { desc }) => {
              if (wsShortcutErr) {
                reject(wsShortcutErr);
              } else {
                let id;
                let version = '3.1.1';
                // only from 3.2, WebCatalog starts using JSON
                try {
                  const appInfo = JSON.parse(desc);
                  id = appInfo.id;
                  version = appInfo.version;
                } catch (jsonErr) {
                  /* eslint-disable no-console */
                  console.log(jsonErr);
                  /* eslint-enable no-console */
                  id = desc;
                }
                installedIds.push({ id, version });
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
