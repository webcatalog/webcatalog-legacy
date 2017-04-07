/* global https os fs remote execFile mkdirp WindowsShortcuts tmp Jimp icongen path pngToIco */

import downloadIconAsync from './downloadIconAsync';

const installAppAsync = ({ allAppPath, appId, appName, appUrl }) =>
  downloadIconAsync(appId)
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
            const execFilePath = path.join(remote.app.getAppPath(), 'app', 'scripts', `applify-${os.platform()}.sh`);
            execFile(execFilePath, [
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
            const shortcutPath = path.join(allAppPath, `${appName}.lnk`);
            WindowsShortcuts.create(shortcutPath, {
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
              const desktopPath = path.join(remote.app.getPath('home'), 'Desktop');
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

export default installAppAsync;
