const { app } = require('electron');
const path = require('path');
const fsExtra = require('fs-extra');

const { getPreference } = require('../preferences');
const sendToAllWindows = require('../send-to-all-windows');

const getInstalledAppsAsync = () => {
  sendToAllWindows('clean-app-management');

  const installationPath = getPreference('installationPath').replace('~', app.getPath('home'));
  const registered = getPreference('registered');

  return Promise.resolve()
    .then(() => {
      const apps = [];

      if (fsExtra.pathExistsSync(installationPath)) {
        return fsExtra.readdir(installationPath, { withFileTypes: true })
          .then((files) => {
            files.forEach((file) => {
              if (!file.isDirectory()) return;
              const fileName = file.name;

              const resourcesPath = process.platform === 'darwin'
                ? path.join(installationPath, fileName, 'Contents', 'Resources')
                : path.join(installationPath, fileName, 'resources');

              const packageJsonPath = path.join(resourcesPath, 'app.asar.unpacked', 'package.json');

              const appJsonPath = path.join(resourcesPath, 'app.asar.unpacked', 'build', 'app.json');
              const iconPath = path.join(resourcesPath, 'app.asar.unpacked', 'build', 'icon.png');

              let packageJson;
              let appJson;
              let icon;
              let lastUpdated = null;

              if (fsExtra.pathExistsSync(packageJsonPath)) {
                packageJson = fsExtra.readJSONSync(packageJsonPath);
                lastUpdated = Math.floor(fsExtra.statSync(packageJsonPath).mtimeMs);
              } else {
                return;
              }

              if (fsExtra.pathExistsSync(appJsonPath)) {
                appJson = fsExtra.readJSONSync(appJsonPath);
                if (registered && appJson.engine === 'electron' && !appJson.registered) {
                  try {
                    fsExtra.writeJSONSync(appJsonPath, { ...appJson, registered });
                    appJson.registered = true;
                  } catch (err) {
                    sendToAllWindows('log', `Failed to register app license ${appJsonPath} ${err ? err.stack : ''}`);
                  }
                }
              } else {
                return;
              }

              if (fsExtra.pathExistsSync(iconPath)) {
                icon = iconPath;
              }

              const appObj = Object.assign(appJson, {
                version: packageJson.version,
                icon,
                engine: appJson.engine || 'electron',
                status: 'INSTALLED',
                lastUpdated,
              });
              apps.push(appObj);
            });
          })
          .then(() => apps);
      }

      return apps;
    })
    .then((apps) => {
      sendToAllWindows('set-app-batch', apps);
    });
};

module.exports = getInstalledAppsAsync;
