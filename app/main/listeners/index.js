const path = require('path');
const {
  app,
  BrowserWindow,
  clipboard,
  ipcMain,
  session,
  shell,
} = require('electron');

const loadAuthListeners = require('./auth');
const loadPreferencesListeners = require('./preferences');

const sendMessageToWindow = require('../libs/send-message-to-window');

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

  ipcMain.on('request-clear-browsing-data', () => {
    const s = session.fromPartition('persist:app');
    if (!s) return;
    s.clearStorageData((err) => {
      if (err) {
        sendMessageToWindow('log', `Clearing browsing data err: ${err.message}`);
        return;
      }
      sendMessageToWindow('reload');
    });
  });

  ipcMain.on('get-web-view-preload-path', (e) => {
    e.returnValue = path.resolve(__dirname, '..', 'web-view-preload.js');
  });

  ipcMain.on('write-to-clipboard', (e, text) => {
    clipboard.writeText(text);
  });
};

module.exports = loadListeners;
