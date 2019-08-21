const { app, dialog, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

const { getPreference } = require('../preferences');
const mainWindow = require('../../windows/main');

const openApp = (id, name) => {
  let appPath;
  if (process.platform === 'darwin') {
    appPath = path.join(getPreference('installationPath').replace('~', app.getPath('home')), `${name}.app`);
    shell.openItem(appPath);
  } else if (process.platform === 'linux') {
    if (process.env.SNAP == null) {
      exec(`gtk-launch webcatalog-${id}`);
    } else {
      dialog.showMessageBox(mainWindow.get(), {
        type: 'info',
        message: 'Because of Snap\'s limitation, we cannot launch the app from here. Please use the app launcher instead.',
      });
    }
  } else if (process.platform === 'win32') {
    appPath = path.join(getPreference('installationPath'), name, `${name}.exe`);
    shell.openItem(appPath);
  }
};

module.exports = openApp;
