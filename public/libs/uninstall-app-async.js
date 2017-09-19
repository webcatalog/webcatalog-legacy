const { app, session } = require('electron');
// eslint-disable-next-line
const fs = require('original-fs');
const os = require('os');
const path = require('path');

const getAllAppPath = require('./get-all-app-path');

const deleteFolderRecursive = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = `${folderPath}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
};

const uninstallAppAsync = (appId, appName, opts) =>
  new Promise((resolve, reject) => {
    try {
      const allAppPath = getAllAppPath();

      switch (os.platform()) {
        case 'darwin': {
          const appPath = path.join(allAppPath, `${appName}.app`);
          deleteFolderRecursive(appPath);

          const altAppPath = path.join(app.getPath('home'), '.webcatalog', `${appName}.app`);
          deleteFolderRecursive(altAppPath);
          break;
        }
        case 'linux': {
          const appPath = path.join(allAppPath, `webcatalog-${appId}.desktop`);
          fs.unlinkSync(appPath);
          break;
        }
        case 'win32':
        default: {
          const appPath = path.join(allAppPath, `${appId}`);
          if (fs.existsSync(appPath)) {
            deleteFolderRecursive(appPath);
          }

          const desktopAppPath = path.join(app.getPath('desktop'), `${appName}.lnk`);
          if (fs.existsSync(desktopAppPath)) {
            fs.unlinkSync(desktopAppPath);
          }

          const startMenuShortcutPath = path.join(app.getPath('home'), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps', `${appName}.lnk`);
          if (fs.existsSync(startMenuShortcutPath)) {
            fs.unlinkSync(startMenuShortcutPath);
          }
        }
      }
    } catch (err) {
      reject(err);
    }

    // try to clear storage data
    if (opts && opts.shouldClearStorageData) {
      const s = session.fromPartition(`persist:${appId}`);
      s.clearStorageData((err) => {
        if (err) {
          /* eslint-disable no-console */
          console.log(`Clearing browsing data err: ${err.message}`);
          /* eslint-enable no-console */
        }
      });
    }

    resolve();
  });

module.exports = uninstallAppAsync;
