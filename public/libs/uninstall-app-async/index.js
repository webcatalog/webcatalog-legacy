const path = require('path');
const fs = require('fs-extra');

const getInstallationPath = require('../get-installation-path');

const uninstallAppAsync = (appId, appName) => {
  const appPath = path.join(getInstallationPath(), `${appName}.app`);
  return fs.remove(appPath);
};

module.exports = uninstallAppAsync;
