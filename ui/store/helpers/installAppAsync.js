/* global https os fs remote execFile mkdirp WindowsShortcuts tmp sharp icongen */

const generateIconSet = (pngPath, iconSizes) => {
  const iconSetPath = tmp.dirSync().name;

  const promises = iconSizes.map(size =>
    new Promise((resolve, reject) => {
      sharp(pngPath)
        .resize(size, size)
        .toFile(`${iconSetPath}/${size}.png`, (err, info) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(info);
        });
    }));

  return Promise.all(promises)
    .then(() => iconSetPath);
};

const pngToIcnsAsync = pngPath =>
  generateIconSet(pngPath, [16, 32, 64, 128, 256, 512, 1024])
    .then((iconSetPath) => {
      const options = {
        type: 'png',
        report: false,
        modes: ['icns'],
      };

      const distPath = tmp.dirSync().name;
      return icongen(iconSetPath, distPath, options)
        .then(() => `${distPath}/app.icns`);
    });

const pngToIcoAsync = pngPath =>
  generateIconSet(pngPath, [16, 24, 32, 48, 64, 128, 256])
    .then((iconSetPath) => {
      const options = {
        type: 'png',
        report: false,
        modes: ['ico'],
      };

      const distPath = tmp.dirSync().name;
      return icongen(iconSetPath, distPath, options)
        .then(() => `${distPath}/app.ico`);
    });

const installAppAsync = ({ allAppPath, appId, appName, appUrl, pngPath }) =>
  Promise.resolve()
    .then(() => {
      switch (os.platform()) {
        case 'darwin': {
          return pngToIcnsAsync(pngPath);
        }
        case 'win32': {
          return pngToIcoAsync(pngPath);
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

export default installAppAsync;
