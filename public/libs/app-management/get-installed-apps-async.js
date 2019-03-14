const path = require('path');
const fsExtra = require('fs-extra');

const getInstallationPath = require('./get-installation-path');

const getInstalledAppsAsync = () => {
  const apps = [];

  const installationPath = getInstallationPath();

  return Promise.resolve()
    .then(() => {
      if (fsExtra.pathExistsSync(installationPath)) {
        return fsExtra.readdir(installationPath)
          .then((files) => {
            files.forEach((fileName) => {
              if (fileName === '.DS_Store') return;

              const packageJsonPath = path.join(installationPath, fileName, 'Contents', 'Resources', 'app.asar.unpacked', 'package.json');

              const legacyAppJsonPath = path.join(installationPath, fileName, 'Contents', 'Resources', 'app.asar.unpacked', 'public', 'app.json');
              const legacyIconPath = path.join(installationPath, fileName, 'Contents', 'Resources', 'app.asar.unpacked', 'public', 'icon.png');

              const appJsonPath = path.join(installationPath, fileName, 'Contents', 'Resources', 'app.asar.unpacked', 'build', 'app.json');
              const iconPath = path.join(installationPath, fileName, 'Contents', 'Resources', 'app.asar.unpacked', 'build', 'icon.png');

              let packageJson;
              let appJson;
              let icon;

              if (fsExtra.pathExistsSync(packageJsonPath)) {
                packageJson = fsExtra.readJSONSync(packageJsonPath);
              } else {
                return;
              }

              if (!fsExtra.pathExistsSync(appJsonPath)
                && !fsExtra.pathExistsSync(legacyAppJsonPath)) {
                return;
              }

              if (fsExtra.pathExistsSync(appJsonPath)) {
                appJson = fsExtra.readJSONSync(appJsonPath);
              } else if (fsExtra.pathExistsSync(legacyAppJsonPath)) {
                appJson = fsExtra.readJSONSync(legacyAppJsonPath);
              } else {
                return;
              }

              if (fsExtra.pathExistsSync(iconPath)) {
                icon = iconPath;
              } else if (fsExtra.pathExistsSync(legacyIconPath)) {
                icon = legacyIconPath;
              }

              apps.push(Object.assign(appJson, {
                version: packageJson.version,
                icon,
                status: 'INSTALLED',
              }));
            });
          });
      }

      return null;
    })
    .then(() => apps);
};

module.exports = getInstalledAppsAsync;
