const { app, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

const { getPreference } = require('../preferences');

const openApp = (id, name) => {
  let appPath;
  if (process.platform === 'darwin') {
    appPath = path.join(getPreference('installationPath').replace('~', app.getPath('home')), `${name}.app`);
    shell.openItem(appPath);
  } else if (process.platform === 'linux') {
    exec(`gtk-launch webcatalog-${id}`);
  }
};

module.exports = openApp;
