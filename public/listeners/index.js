const {
  ipcMain,
  shell,
} = require('electron');

const loadAuthListeners = require('./auth');
const loadLocalListeners = require('./local');
const loadUpdaterListeners = require('./updater');

const loadListeners = () => {
  loadAuthListeners();
  loadLocalListeners();
  loadUpdaterListeners();

  ipcMain.on('open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });
};

module.exports = loadListeners;
