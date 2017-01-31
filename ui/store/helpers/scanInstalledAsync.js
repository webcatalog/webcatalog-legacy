/* global fs WindowsShortcuts https os */

const scanInstalledAsync = allAppPath =>
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
            const id = fs.readFileSync(`${allAppPath}/${fileName}/id`, 'utf8').trim();
            installedIds.push(id);
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
            installedIds.push(id);
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
          files.forEach((fileName) => {
            WindowsShortcuts.query(`${allAppPath}/${fileName}`, (wsShortcutErr, { desc }) => {
              if (wsShortcutErr) {
                reject(wsShortcutErr);
              } else {
                installedIds.push(desc);
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
