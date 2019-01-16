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
              const appJsonPath = path.join(installationPath, fileName, 'Contents', 'Resources', 'app.asar.unpacked', 'public', 'app.json');
              const iconPath = path.join(installationPath, fileName, 'Contents', 'Resources', 'app.asar.unpacked', 'public', 'icon.png');

              if (!fsExtra.pathExistsSync(appJsonPath)) return;
              if (!fsExtra.pathExistsSync(packageJsonPath)) return;

              const appJson = fsExtra.readJSONSync(appJsonPath);
              const packageJson = fsExtra.readJSONSync(packageJsonPath);

              apps.push(Object.assign(appJson, {
                version: packageJson.version,
                icon: iconPath,
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
