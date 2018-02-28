const { ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const loadGenericListeners = () => {
  ipcMain.on('request-open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });

  ipcMain.on('is-chrome-installed', (e) => {
    const chromePath = path.join('/Applications', 'Google Chrome.app');
    e.returnValue = fs.existsSync(chromePath);
  });
};

module.exports = loadGenericListeners;
