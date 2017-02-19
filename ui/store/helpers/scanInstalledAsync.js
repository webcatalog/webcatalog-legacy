/* global fs WindowsShortcuts https os */

const scanInstalledAsync = allAppPath =>
  new Promise((resolve, reject) => {
    const installedIds = [];

    if (!fs.existsSync(allAppPath)) {
      fs.mkdirSync(allAppPath);
    }

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

            // update app
            const appName = fileName.replace('.app', '');
            const appExecPath = `${allAppPath}/${fileName}/Contents/MacOS/${appName}`;
            fs.readFile(appExecPath, 'utf-8', (readFileErr, script) => {
              if (readFileErr) {
                /* eslint-disable no-console */
                console.log(readFileErr);
                /* eslint-enable no-console */
                return;
              }

              const oldPath = '/Applications/WebCatalog.app/Contents/MacOS/WebCatalog';
              const newPath = '/Applications/WebCatalog.app/Contents/Resources/WebCatalog_Alt';

              if (script.indexOf(`${oldPath} `) > -1) {
                const newScript = script.replace(
                  `${oldPath} `,
                  `${newPath} `,
                );

                fs.writeFile(appExecPath, newScript, 'utf-8', (writeFileErr) => {
                  if (writeFileErr) {
                    /* eslint-disable no-console */
                    console.log(writeFileErr);
                    /* eslint-enable no-console */
                  }
                });
              }
            });
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

          if (files.length === 0) resolve(installedIds);

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
