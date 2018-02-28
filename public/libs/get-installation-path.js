const { app } = require('electron');
const path = require('path');

const getInstallationPath = () => {
  if (process.platform === 'linux') {
    return path.join(app.getPath('home'), 'bin');
  }

  return path.join(app.getPath('home'), 'Applications', 'WebCatalog Lite Apps');
};

module.exports = getInstallationPath;
