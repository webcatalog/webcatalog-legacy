const { app } = require('electron');
const path = require('path');
const fs = require('fs-extra');

const getInstallationPath = require('../get-installation-path');

const uninstallAppAsync = (appId, appName) => {
  const p = [];

  if (process.platform === 'darwin') {
    const appPath = path.join(getInstallationPath(), `${appName}.app`);
    p.push(fs.remove(appPath));

    const dataPath = path.join(app.getPath('home'), '.webcatalog-lite', appId);
    p.push(fs.remove(dataPath));
  } else if (process.platform === 'linux') {
    const binPath = path.join(getInstallationPath(), `${appId}`);
    p.push(fs.remove(binPath));

    const desktopPath = path.join(app.getPath('home'), '.local', 'share', 'applications', `webcatalog-${appId}.desktop`);
    p.push(fs.remove(desktopPath));

    const dataPath = path.join(app.getPath('home'), '.config', `webcatalog-${appId}`);
    p.push(fs.remove(dataPath));
  } else if (process.platform === 'win32') {
    const desktopShortcutPath = path.join(app.getPath('desktop'), `${appName}.lnk`);
    const startMenuShortcutPath = path.join(getInstallationPath(), `${appName}.lnk`);

    p.push(fs.remove(desktopShortcutPath));
    p.push(fs.remove(startMenuShortcutPath));
  } else {
    return Promise.reject(new Error('Platform undefined.'));
  }

  return Promise.all(p);
};

module.exports = uninstallAppAsync;
