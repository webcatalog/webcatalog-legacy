const path = require('path');
const fs = require('fs');
const commandExistsSync = require('command-exists').sync;

const getWin32ChromePaths = require('./get-win32-chrome-paths');
const getWin32FirefoxPaths = require('./get-win32-firefox-paths');

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
    case 'chrome':
    default: {
      if (process.platform === 'darwin') {
        const chromePath = path.join('/Applications', 'Google Chrome.app');
        return fs.existsSync(chromePath);
      }

      if (process.platform === 'linux') {
        return commandExistsSync('chrome');
      }

      if (process.platform === 'win32') {
        const chromePaths = getWin32ChromePaths();
        return chromePaths.length > 0;
      }

      return false;
    }
  }
};

module.exports = isEngineInstalled;
