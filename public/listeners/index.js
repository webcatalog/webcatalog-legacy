const {
  ipcMain,
  shell,
} = require('electron');

const loadAuthListeners = require('./auth');
const loadCoreListeners = require('./core');
const loadUpdaterListeners = require('./updater');

const loadListeners = () => {
  loadAuthListeners();
  loadCoreListeners();
  loadUpdaterListeners();

  ipcMain.on('open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });
};

module.exports = loadListeners;
