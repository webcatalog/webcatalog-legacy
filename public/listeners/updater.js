const {
  ipcMain,
} = require('electron');

const autoUpdater = require('../libs/auto-updater');

const loadUpdaterListeners = () => {
  ipcMain.on('request-check-for-updates', () => {
    autoUpdater.checkForUpdates();
  });

  ipcMain.on('request-quit-and-install', () => {
    autoUpdater.quitAndInstall();
  });
};

module.exports = loadUpdaterListeners;
