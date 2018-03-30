const { app } = require('electron');
const path = require('path');

const getInstallationPath = () => {
  if (process.platform === 'linux') {
    return path.join(app.getPath('home'), 'bin');
  }

  if (process.platform === 'win32') {
    return path.join(app.getPath('home'), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Lite Apps');
  }

  return path.join(app.getPath('home'), 'Applications', 'WebCatalog Lite Apps');
};

module.exports = getInstallationPath;
