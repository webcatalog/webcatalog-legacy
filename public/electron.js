const path = require('path');
const { app } = require('electron');

const createMenu = require('./libs/create-menu');
const loadListeners = require('./listeners');

const mainWindow = require('./windows/main');

require('./libs/updater');

const gotTheLock = app.requestSingleInstanceLock();

app.on('second-instance', () => {
  const win = mainWindow.get();
  if (win != null) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

if (!gotTheLock) {
  app.quit();
} else {
  loadListeners();

  app.on('ready', () => {
    global.defaultIcon = path.join(app.getAppPath(), 'default-icon.png');

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
