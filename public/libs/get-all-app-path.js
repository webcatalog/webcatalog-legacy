const { app } = require('electron');
const os = require('os');
const path = require('path');

const getAllAppPath = () => {
  switch (os.platform()) {
    case 'darwin': {
      return path.join(app.getPath('home'), 'Applications', 'WebCatalog Apps');
    }
    case 'linux': {
      return path.join(app.getPath('userData'), 'apps');
    }
    case 'win32':
    default: {
      return path.join(app.getPath('userData'), 'Apps');
    }
  }
};

module.exports = getAllAppPath;
