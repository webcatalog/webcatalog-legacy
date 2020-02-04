const path = require('path');
const fs = require('fs');
const commandExistsSync = require('command-exists').sync;

const getWin32BravePaths = require('./get-win32-brave-paths');
const getWin32ChromePaths = require('./get-win32-chrome-paths');
const getWin32FirefoxPaths = require('./get-win32-firefox-paths');
const getWin32VivaldiPaths = require('./get-win32-vivaldi-paths');
const getWin32EdgePaths = require('./get-win32-edge-paths');

const isEngineInstalled = (browser) => {
  switch (browser) {
    case 'firefox': {
      if (process.platform === 'darwin') {
        const firefoxPath = path.join('/Applications', 'Firefox.app');
        return fs.existsSync(firefoxPath);
      }

      if (process.platform === 'win32') {
        const firefoxPaths = getWin32FirefoxPaths();
        return firefoxPaths.length > 0;
      }

      if (process.platform === 'linux') {
        return commandExistsSync('firefox');
      }

      return false;
    }
    case 'electron': {
      return true;
    }
    case 'chromium': {
      if (process.platform === 'darwin') {
        const chromiumPath = path.join('/Applications', 'Chromium.app');
        return fs.existsSync(chromiumPath);
      }

      if (process.platform === 'linux') {
        return commandExistsSync('chromium-browser');
      }

      return false;
    }
    case 'brave': {
      if (process.platform === 'darwin') {
        const bravePath = path.join('/Applications', 'Brave Browser.app');
        return fs.existsSync(bravePath);
      }

      if (process.platform === 'linux') {
        return commandExistsSync('brave-browser');
      }

      if (process.platform === 'win32') {
        const bravePaths = getWin32BravePaths();
        return bravePaths.length > 0;
      }

      return false;
    }
    case 'vivaldi': {
      if (process.platform === 'darwin') {
        const bravePath = path.join('/Applications', 'Vivaldi.app');
        return fs.existsSync(bravePath);
      }

      if (process.platform === 'linux') {
        return commandExistsSync('vivaldi');
      }

      if (process.platform === 'win32') {
        const bravePaths = getWin32VivaldiPaths();
        return bravePaths.length > 0;
      }

      return false;
    }
    case 'chrome': {
      if (process.platform === 'darwin') {
        const chromePath = path.join('/Applications', 'Google Chrome.app');
        return fs.existsSync(chromePath);
      }

      if (process.platform === 'linux') {
        return commandExistsSync('google-chrome');
      }

      if (process.platform === 'win32') {
        const chromePaths = getWin32ChromePaths();
        return chromePaths.length > 0;
      }

      return false;
    }
    case 'edge': {
      if (process.platform === 'darwin') {
        const chromePath = path.join('/Applications', 'Microsoft Edge.app');
        return fs.existsSync(chromePath);
      }

      if (process.platform === 'win32') {
        const chromePaths = getWin32EdgePaths();
        return chromePaths.length > 0;
      }

      return false;
    }
    default: {
      return false;
    }
  }
};

module.exports = isEngineInstalled;
