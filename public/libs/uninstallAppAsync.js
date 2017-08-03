const { app, session } = require('electron');
const fs = require('original-fs');
const os = require('os');
const path = require('path');

const getAllAppPath = require('./getAllAppPath');

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
          const appPath = path.join(allAppPath, `${appName}.lnk`);
          if (fs.existsSync(appPath)) {
            fs.unlinkSync(appPath);
          }

          const desktopPath = path.join(app.getPath('home'), 'Desktop');
          const desktopAppPath = path.join(desktopPath, `${appName}.lnk`);
          if (fs.existsSync(desktopAppPath)) {
            fs.unlinkSync(desktopAppPath);
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
