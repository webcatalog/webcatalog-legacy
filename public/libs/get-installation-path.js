const { app } = require('electron');
const path = require('path');

const getInstallationPath = () =>
  path.join(app.getPath('home'), 'Applications', 'WebCatalog Lite Apps');

module.exports = getInstallationPath;
