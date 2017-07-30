const { autoUpdater } = require('electron-updater');

const sendMessageToWindow = require('./sendMessageToWindow');

autoUpdater.on('checking-for-update', () => {
  sendMessageToWindow('set-updater-status', 'CHECKING_FOR_UPDATES');
});

autoUpdater.on('update-available', (info) => {
  sendMessageToWindow('set-updater-status', 'UPDATE_AVAILABLE', info);
});

autoUpdater.on('update-not-available', (info) => {
  sendMessageToWindow('set-updater-status', 'UPDATE_NOT_AVAILABLE', info);
});

autoUpdater.on('error', (err) => {
  sendMessageToWindow('set-updater-status', 'UPDATE_ERROR');
  sendMessageToWindow('log', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  sendMessageToWindow('set-updater-status', 'UPDATE_PROGRESS', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
  sendMessageToWindow('set-updater-status', 'UPDATE_DOWNLOADED', info);
});

module.exports = autoUpdater;
