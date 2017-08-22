const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
} = require('electron');

const loadAuthListeners = require('./auth');
const loadPreferencesListeners = require('./preferences');

const loadListeners = () => {
  loadAuthListeners();
  loadPreferencesListeners();

  ipcMain.on('request-open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });

  ipcMain.on('is-full-screen', (e) => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      e.returnValue = windows[0].isFullScreen();
    }
    e.returnValue = false;
  });

  ipcMain.on('request-force-reload', () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      windows[0].reload();
    }
  });

  ipcMain.on('request-relaunch', () => {
    app.relaunch();
    app.exit(0);
  });
};

module.exports = loadListeners;
