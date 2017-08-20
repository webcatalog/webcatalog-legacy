const { app } = require('electron');
const os = require('os');
const path = require('path');

const getAllAppPath = () => {
  let allAppPath;
  switch (os.platform()) {
    case 'darwin': {
      allAppPath = path.join(app.getPath('home'), 'Applications', 'WebCatalog Apps');
      break;
    }
    case 'linux': {
      allAppPath = path.join(app.getPath('home'), '.local', 'share', 'applications');
      break;
    }
    case 'win32':
    default: {
      allAppPath = path.join(app.getPath('userData'), 'Apps');
    }
  }

  return allAppPath;
};

module.exports = getAllAppPath;
