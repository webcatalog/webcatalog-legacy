const { app, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const commandExistsSync = require('command-exists').sync;

const getWin32ChromePaths = require('../libs/get-win32-chrome-paths');

const loadGenericListeners = () => {
  ipcMain.on('request-open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });

  ipcMain.on('is-chrome-installed', (e, browser) => {
    switch (browser) {
      case 'juli': {
        if (process.platform === 'darwin') {
          const juliPath = path.join('/Applications', 'Juli.app');
          e.returnValue = fs.existsSync(juliPath);
          return;
        }

        if (process.platform === 'win32') {
          const juliPath = path.join(app.getPath('home'), 'AppData', 'Local', 'Programs', 'Juli', 'Juli.exe');
          e.returnValue = fs.existsSync(juliPath);
          return;
        }

        e.returnValue = false;
        return;
      }
      case 'chromium': {
        if (process.platform === 'darwin') {
          const chromiumPath = path.join('/Applications', 'Chromium.app');
          e.returnValue = fs.existsSync(chromiumPath);
          return;
        }

        if (process.platform === 'linux') {
          e.returnValue = commandExistsSync('chromium-browser');
          return;
        }

        e.returnValue = false;
        return;
      }
      case 'google-chrome':
      default: {
        if (process.platform === 'darwin') {
          const chromePath = path.join('/Applications', 'Google Chrome.app');
          e.returnValue = fs.existsSync(chromePath);
          return;
        }

        if (process.platform === 'linux') {
          e.returnValue = commandExistsSync('google-chrome');
          return;
        }

        if (process.platform === 'win32') {
          const chromePaths = getWin32ChromePaths();
          e.returnValue = chromePaths.length > 0;
        }
      }
    }
  });
};

module.exports = loadGenericListeners;
