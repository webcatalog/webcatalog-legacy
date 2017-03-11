/* global https os fs remote execFile mkdirp WindowsShortcuts */

const installAppAsync = ({ allAppPath, appId, appName, appUrl }) =>
  new Promise((resolve, reject) => {
    let iconExt;
    switch (os.platform()) {
      case 'darwin': {
        iconExt = 'icns';
        break;
      }
      case 'linux': {
        iconExt = 'png';
        break;
      }
      case 'win32':
      default: {
        iconExt = 'ico';
      }
    }

    const iconPath = `${remote.app.getPath('temp')}/${Math.floor(Date.now())}.${iconExt}`;
    const iconFile = fs.createWriteStream(iconPath);

    https.get(`https://cdn.rawgit.com/webcatalog/backend/compiled/images/${appId}.${iconExt}`, (response) => {
      response.pipe(iconFile);
      iconFile.on('finish', () => {
        const jsonContent = JSON.stringify({
          id: appId,
          name: appName,
          url: appUrl,
          version: remote.app.getVersion(),
        }); // data to track app info & version

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

              resolve();
            });
          }
        }
      });
    });
  });

export default installAppAsync;
