const {
  BrowserWindow,
  ipcMain,
  shell,
} = require('electron');

const loadAuthListeners = require('./auth');
const loadSettingsListeners = require('./settings');

const loadListeners = () => {
  loadAuthListeners();
  loadSettingsListeners();

  ipcMain.on('open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });

  ipcMain.on('is-full-screen', (e) => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      e.returnValue = windows[0].isFullScreen();
    }
  });
};

module.exports = loadListeners;
