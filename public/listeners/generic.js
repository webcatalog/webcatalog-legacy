const { ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const commandExistsSync = require('command-exists').sync;

const loadGenericListeners = () => {
  ipcMain.on('request-open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });

  ipcMain.on('is-chrome-installed', (e) => {
    if (process.platform === 'darwin') {
      const chromePath = path.join('/Applications', 'Google Chrome.app');
      e.returnValue = fs.existsSync(chromePath);
    }

    if (process.platform === 'linux') {
      e.returnValue = commandExistsSync('google-chrome');
    }
  });
};

module.exports = loadGenericListeners;
