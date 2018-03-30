const fs = require('fs-extra');
const packager = require('electron-packager');
const path = require('path');
const tmp = require('tmp');

const createIconAsync = require('./create-icon-async');

const createAppAsync = (id, name, url, inputIcon, out) => {
  const appDir = path.resolve(__dirname, '..', '..', '..', 'template').replace('app.asar', 'app.asar.unpacked');
  let tmpDir;

  return Promise.resolve()
    .then(() => {
      const tmpObj = tmp.dirSync();
      tmpDir = tmpObj.name;
    })
    .then(() => {
      if (inputIcon) return createIconAsync(inputIcon, tmpDir);
      return null;
    })
    .then(icon =>
      new Promise((resolve, reject) => {
        const options = {
          name,
          icon,
          platform: process.platform,
          dir: appDir,
          out,
          overwrite: true,
          prune: false,
          asar: {
            unpack: 'package.json',
          },
        };

        return packager(options, (err, appPaths) => {
          if (err) {
            return reject(err);
          }

          return resolve(appPaths);
        });
      }))
    .then((appPaths) => {
      let destPath;

      if (process.platform === 'darwin') {
        const binaryFileName = `${name}.app`;
        destPath = path.join(appPaths[0], binaryFileName);
      } else {
        destPath = appPaths[0]; // eslint-disable-line
      }

      const resourcesPath = process.platform === 'darwin' ? path.join(destPath, 'Contents', 'Resources')
        : path.join(destPath, 'resources');

      const packageJsonPath = path.join(resourcesPath, 'app.asar.unpacked', 'package.json');

      return fs.readJson(packageJsonPath)
        .then((packageJsonTemplate) => {
          const packageJson = Object.assign({}, packageJsonTemplate, {
            name: id,
            productName: name,
            webApp: {
              id,
              name,
              url,
            },
          });
          return fs.writeJson(packageJsonPath, packageJson);
        })
        .then(() => {
          if (inputIcon) {
            return fs.copy(inputIcon, path.join(resourcesPath, 'icon.png'));
          }

          return null;
        })
        .then(() => appPaths[0]);
    })
    .catch(err => Promise.reject(err));
};

module.exports = createAppAsync;
