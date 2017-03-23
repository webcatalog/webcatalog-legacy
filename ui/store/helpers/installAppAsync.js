/* global https os fs remote execFile mkdirp WindowsShortcuts tmp */

import pngToIcnsAsync from './pngToIcnsAsync';

const installAppAsync = ({ allAppPath, appId, appName, appUrl }) => {
  Promise.resolve()
    .then(() => {
      const pngPath = tmp.fileSync().name;

      return new Promise((resolve, reject) => {
        const iconFile = fs.createWriteStream(pngPath);

        const req = https.get(`https://cdn.rawgit.com/webcatalog/backend/compiled/images/${appId}.png`, (response) => {
          response.pipe(iconFile);

          iconFile.on('error', (err) => {
            reject(err);
          });

          iconFile.on('finish', () => {
            resolve(pngPath);
          });
        });

        req.on('error', (err) => {
          reject(err);
        });
      });
    })
    .then((pngPath) => {
      switch (os.platform()) {
        case 'darwin': {
          return pngToIcnsAsync(pngPath);
        }
        case 'linux':
        default: {
          return pngPath;
        }
      }
    })
    .then((iconPath) => {
      const jsonContent = JSON.stringify({
        id: appId,
        name: appName,
        url: appUrl,
        version: remote.app.getVersion(),
      }); // data to track app info & version

      return new Promise((resolve, reject) => {
        switch (os.platform()) {
          case 'darwin':
          case 'linux': {
            execFile(`${remote.app.getAppPath()}/scripts/applify-${os.platform()}.sh`, [
              appName,
              appUrl,
              iconPath,
              appId,
              jsonContent,
            ], (err) => {
              if (err) {
                reject(err);
                return;
              }

              resolve();
            });
            break;
          }
          case 'win32':
          default: {
            WindowsShortcuts.create(`${allAppPath}/${appName}.lnk`, {
              target: '%userprofile%/AppData/Local/Programs/WebCatalog/WebCatalog.exe',
              args: `--name="${appName}" --url="${appUrl}" --id="${appId}"`,
              icon: iconPath,
              desc: jsonContent,
            }, (err) => {
              if (err) {
                reject(err);
                return;
              }

              // create desktop shortcut
              const desktopPath = `${remote.app.getPath('home')}/Desktop`;
              WindowsShortcuts.create(`${desktopPath}/${appName}.lnk`, {
                target: '%userprofile%/AppData/Local/Programs/WebCatalog/WebCatalog.exe',
                args: `--name="${appName}" --url="${appUrl}" --id="${appId}"`,
                icon: iconPath,
                desc: jsonContent,
              }, (desktopShortcutErr) => {
                if (desktopShortcutErr) {
                  reject(desktopShortcutErr);
                  return;
                }

                resolve();
              });
            });
          }
        }
      });
    });
};

export default installAppAsync;
