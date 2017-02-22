/* global fs WindowsShortcuts https os execFile remote */

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

            // if id file exists, the .app needs to be updated
            const idPath = `${allAppPath}/${fileName}/id`;
            let appId;
            if (fs.existsSync(idPath)) {
              appId = fs.readFileSync(idPath, 'utf8').trim();
              installedIds.push(appId);

              // update app
              const appName = fileName.replace('.app', '');
              const appExecPath = `${allAppPath}/${fileName}/Contents/MacOS/${appName}`;
              fs.readFile(appExecPath, 'utf-8', (readFileErr, oldScript) => {
                if (readFileErr) {
                  /* eslint-disable no-console */
                  console.log(readFileErr);
                  /* eslint-enable no-console */
                  return;
                }

                const appUrl = oldScript
                  .match(/(--url=")(.+)(" --id)/)[0]
                  .replace('--url="', '')
                  .replace('" --id', '');

                // store icon temporarily as old .app will be removed
                const tmpIcns = `${remote.app.getPath('temp')}/${Math.floor(Date.now())}.icns`;
                fs.writeFileSync(tmpIcns, fs.readFileSync(`${allAppPath}/${fileName}/Contents/Resources/${appName}.icns`));

                execFile(`${remote.app.getAppPath()}/scripts/applify-${os.platform()}.sh`, [
                  appName,
                  appUrl,
                  tmpIcns, // iconPath
                  appId,
                ], (execErr) => {
                  if (err) {
                    /* eslint-disable no-console */
                    console.log(execErr);
                    /* eslint-enable no-console */
                  }
                });
              });
            } else {
              const infoPath = `${allAppPath}/${fileName}/Contents/Resources/info.json`;
              const appInfo = JSON.parse(fs.readFileSync(infoPath, 'utf8'));

              installedIds.push(appInfo.id);
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
