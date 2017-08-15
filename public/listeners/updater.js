const {
  ipcMain,
} = require('electron');

const autoUpdater = require('../libs/auto-updater');

const loadUpdaterListeners = () => {
  ipcMain.on('check-for-updates', () => {
    autoUpdater.checkForUpdates();
  });

  ipcMain.on('quit-and-install', () => {
    autoUpdater.quitAndInstall();
  });
};

module.exports = loadUpdaterListeners;
