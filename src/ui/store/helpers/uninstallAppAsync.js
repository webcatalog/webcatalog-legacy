import { remote } from 'electron';

const deleteFolderRecursive = (path) => {
  const fs = remote.require('fs');

  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const uninstallAppAsync = ({ allAppPath, appId, appName }) =>
  new Promise((resolve, reject) => {
    try {
      const os = remote.require('os');
      const path = remote.require('path');
      const fs = remote.require('fs');

      switch (os.platform()) {
        case 'darwin': {
          const appPath = path.join(allAppPath, `${appName}.app`);
          deleteFolderRecursive(appPath);

          const altAppPath = path.join(remote.app.getPath('home'), '.webcatalog', `${appName}.app`);
          deleteFolderRecursive(altAppPath);
          break;
        }
        case 'linux': {
          const appPath = path.join(allAppPath, `${appId}.desktop`);
          fs.unlinkSync(appPath);
          break;
        }
        case 'win32':
        default: {
          const appPath = path.join(allAppPath, `${appName}.lnk`);
          fs.unlinkSync(appPath);

          const desktopPath = path.join(remote.app.getPath('home'), 'Desktop');
          const desktopAppPath = path.join(desktopPath, `${appName}.lnk`);
          fs.unlinkSync(desktopAppPath);
        }
      }
    } catch (err) {
      reject(err);
    }

    // try to clear storage data
    const s = remote.session.fromPartition(`persist:${appId}`);
    s.clearStorageData((err) => {
      if (err) {
        /* eslint-disable no-console */
        console.log(`Clearing browsing data err: ${err.message}`);
        /* eslint-enable no-console */
      }
    });

    resolve();
  });

export default uninstallAppAsync;
