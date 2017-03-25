/* global https os fs remote execFile mkdirp WindowsShortcuts tmp Jimp icongen path */

const generateIconSet = (pngPath, iconSizes) => {
  const iconSetPath = tmp.dirSync().name;

  return Jimp.read(pngPath)
    .then((png) => {
      const promises = iconSizes.map(size =>
        new Promise((resolve) => {
          png.resize(size, size)            // resize
             .write(path.join(iconSetPath, `${size}.png`), resolve); // save
        }));

      return Promise.all(promises);
    })
    .then(() => iconSetPath);
};

const pngToIcnsAsync = pngPath =>
  generateIconSet(pngPath, [1024, 512, 256, 128, 64, 32, 16])
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
  generateIconSet(pngPath, [256, 128, 64, 48, 32, 24, 16])
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
