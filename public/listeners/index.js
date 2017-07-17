const {
  ipcMain,
  shell,
} = require('electron');

const loadAuthListeners = require('./auth');

const loadListeners = () => {
  loadAuthListeners();

  ipcMain.on('open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });
};

module.exports = loadListeners;
