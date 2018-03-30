const { shell } = require('electron');
const path = require('path');

const getInstallationPath = require('./get-installation-path');

const openApp = (id, name) => {
  if (process.platform === 'darwin') {
    const appPath = path.join(getInstallationPath(), `${name}.app`);
    shell.openItem(appPath);
  }

  if (process.platform === 'win32') {
    const exePath = path.join(getInstallationPath(), id, `${name}.exe`);
    shell.openItem(exePath);
  }
};

module.exports = openApp;
