const path = require('path');
const {
  app,
  BrowserWindow,
  clipboard,
  ipcMain,
  session,
  shell,
} = require('electron');
const argv = require('yargs-parser')(process.argv.slice(1));

const loadPreferencesListeners = require('./preferences');

const sendMessageToWindow = require('../libs/send-message-to-window');

const loadListeners = () => {
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
    app.quit();
  });

  ipcMain.on('request-clear-browsing-data', () => {
    const s = session.fromPartition(`persist:${argv.id}`);
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

  /* Badge count */
  // support macos
  const setDockBadge = (process.platform === 'darwin') ? app.dock.setBadge : () => {};

  ipcMain.on('badge', (e, badge) => {
    setDockBadge(badge);
  });

  ipcMain.on('request-open-webcatalog', () => {
    shell.openItem('/Applications/WebCatalog.app');
  });
};

module.exports = loadListeners;
