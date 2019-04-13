const { app } = require('electron');
const path = require('path');

const { getPreference } = require('./../preferences');

const getInstallationPath = () => {
  const installLocation = getPreference('installLocation');
  if (installLocation === 'root') {
    return path.join('/', 'Applications', 'WebCatalog Apps');
  }
  return path.join(app.getPath('home'), 'Applications', 'WebCatalog Apps');
};

module.exports = getInstallationPath;
