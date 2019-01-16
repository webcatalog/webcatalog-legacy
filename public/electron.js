const path = require('path');
const { app } = require('electron');

const createMenu = require('./libs/create-menu');
const loadListeners = require('./listeners');

const mainWindow = require('./windows/main');

require('./libs/updater');

const gotTheLock = app.requestSingleInstanceLock();

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (!gotTheLock) {
  app.quit();
} else {
  loadListeners();

  app.on('ready', () => {
    global.defaultIcon = path.join(app.getAppPath(), 'default-icon.png').replace('app.asar', 'app.asar.unpacked');

    mainWindow.create();
    createMenu();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    mainWindow.show();
  });
}
