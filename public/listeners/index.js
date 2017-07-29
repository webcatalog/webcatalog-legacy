const {
  ipcMain,
  shell,
} = require('electron');

const loadAuthListeners = require('./auth');
const loadUsedAppsManagedListeners = require('./user-apps-managed');
const loadUpdaterListeners = require('./updater');

const loadListeners = () => {
  loadAuthListeners();
  loadUsedAppsManagedListeners();
  loadUpdaterListeners();

  ipcMain.on('open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });
};

module.exports = loadListeners;
