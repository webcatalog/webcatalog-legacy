const { app, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fsExtra = require('fs-extra');

const { getPreference } = require('../preferences');

const openApp = (id, name) => {
  if (process.platform === 'darwin') {
    const appPath = path.join(getPreference('installationPath').replace('~', app.getPath('home')), `${name}.app`);
    shell.openItem(appPath);
  } else if (process.platform === 'linux') {
    exec(`gtk-launch webcatalog-${id}`);
  } else if (process.platform === 'win32') {
    const shortcutPath = path.join(getPreference('installationPath'), name, `${name}.lnk`);
    if (fsExtra.existsSync(shortcutPath)) {
      shell.openItem(shortcutPath);
      return;
    }
    const appPath = path.join(getPreference('installationPath'), name, `${name}.exe`);
    shell.openItem(appPath);
  }
};

module.exports = openApp;
