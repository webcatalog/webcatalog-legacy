const { app } = require('electron');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

// legacy
// will be removed soon
if (os.platform() === 'linux') {
  const oldPath = path.join(app.getPath('userData'), 'apps');
  fs.removeSync(oldPath);
}

const getAllAppPath = () => {
  switch (os.platform()) {
    case 'darwin': {
      return path.join(app.getPath('home'), 'Applications', 'WebCatalog Apps');
    }
    case 'linux': {
      return path.join(app.getPath('home'), '.webcatalog', 'apps');
    }
    case 'win32':
    default: {
      return path.join(app.getPath('userData'), 'Apps');
    }
  }
};

module.exports = getAllAppPath;
