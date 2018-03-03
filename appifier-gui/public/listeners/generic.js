const {
  ipcMain,
  shell,
} = require('electron');

const loadGenericListeners = () => {
  ipcMain.on('request-open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });
};

module.exports = loadGenericListeners;
