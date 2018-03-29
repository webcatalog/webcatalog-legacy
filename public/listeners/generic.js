const { ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const commandExistsSync = require('command-exists').sync;

const getWin32ChromePaths = require('../libs/get-win32-chrome-paths');

const loadGenericListeners = () => {
  ipcMain.on('request-open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });

  ipcMain.on('is-chrome-installed', (e, browser) => {
    console.log(getWin32ChromePaths());

    switch (browser) {
      case 'chromium': {
        if (process.platform === 'darwin') {
          const chromiumPath = path.join('/Applications', 'Chromium.app');
          e.returnValue = fs.existsSync(chromiumPath);
        }

        if (process.platform === 'linux') {
          e.returnValue = commandExistsSync('chromium-browser');
        }
        break;
      }
      case 'google-chrome': {
        if (process.platform === 'darwin') {
          const chromePath = path.join('/Applications', 'Google Chrome.app');
          e.returnValue = fs.existsSync(chromePath);
        }

        if (process.platform === 'linux') {
          e.returnValue = commandExistsSync('google-chrome');
        }
        break;
      }
      default: {
        e.returnValue = false;
      }
    }
  });
};

module.exports = loadGenericListeners;
