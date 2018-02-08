const { app } = require('electron');
const path = require('path');

const getInstallationPath = () =>
  path.join(app.getPath('home'), 'Applications', 'WebCatalog Apps');

module.exports = getInstallationPath;
