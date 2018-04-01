const { app } = require('electron');
const path = require('path');

const getInstallationPath = () => {
  if (process.platform === 'darwin') {
    return path.join(app.getPath('home'), 'Applications', 'Juli Apps');
  }

  return path.join(app.getPath('home'), '.juli', 'apps');
};

module.exports = getInstallationPath;
