const path = require('path');
const fs = require('fs');

const isEngineInstalled = (browser) => {
  switch (browser) {
    case 'firefox': {
      if (process.platform === 'darwin') {
        const firefoxPath = path.join('/Applications', 'Firefox.app');
        return fs.existsSync(firefoxPath);
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


      return false;
    }
    case 'chrome':
    default: {
      if (process.platform === 'darwin') {
        const chromePath = path.join('/Applications', 'Google Chrome.app');
        return fs.existsSync(chromePath);
      }

      return false;
    }
  }
};

module.exports = isEngineInstalled;
