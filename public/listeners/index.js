const {
  ipcMain,
  shell,
} = require('electron');

const loadAuthListeners = require('./auth');
const loadCoreListeners = require('./core');

const loadListeners = () => {
  loadAuthListeners();
  loadCoreListeners();

  ipcMain.on('open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });
};

module.exports = loadListeners;
