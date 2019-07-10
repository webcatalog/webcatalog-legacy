const {
  app,
  BrowserWindow,
  clipboard,
  ipcMain,
  session,
  shell,
} = require('electron');
const path = require('path');

const sendMessageToWindow = require('../libs/send-message-to-window');

const loadGenericListeners = () => {
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

  ipcMain.on('request-erase', () => {
    const s = session.fromPartition('app');
    if (!s) return;
    s.clearStorageData((err) => {
      if (err) {
        sendMessageToWindow('erase-failed');
        return;
      }
      sendMessageToWindow('erase-finished');
    });
  });

  ipcMain.on('get-web-view-preload-path', (e) => {
    e.returnValue = path.resolve(__dirname, '..', 'web-view-preload.js');
  });

  ipcMain.on('get-home-path', (e) => {
    e.returnValue = path.resolve(__dirname, '..', 'home.html');
  });

  ipcMain.on('write-to-clipboard', (e, text) => {
    clipboard.writeText(text);
  });
};

module.exports = loadGenericListeners;
