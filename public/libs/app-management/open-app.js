const { shell } = require('electron');
const path = require('path');

const getInstallationPath = require('./get-installation-path');

const openApp = (id, name) => {
  const appPath = path.join(getInstallationPath(), `${name}.app`);
  shell.openItem(appPath);
};

module.exports = openApp;
