const { shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

const getInstallationPath = require('./get-installation-path');

const openApp = (id, name) => {
  if (process.platform === 'darwin') {
    const appPath = path.join(getInstallationPath(), `${name}.app`);
    shell.openItem(appPath);
  }

  if (process.platform === 'linux') {
    exec(`gtk-launch webcatalog-${id}`);
  }

  if (process.platform === 'win32') {
    const shortcutPath = path.join(getInstallationPath(), `${name}.lnk`);
    shell.openItem(shortcutPath);
  }
};

module.exports = openApp;
