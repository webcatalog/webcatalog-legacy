const fs = require('fs-extra');
const packager = require('electron-packager');
const path = require('path');
const tmp = require('tmp');

const createIconAsync = require('./create-icon-async');

const createAppAsync = (id, name, url, inputIcon, out) => {
  const appDir = path.resolve(__dirname, '..', 'app').replace('app.asar', 'app.asar.unpacked');
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
            unpack: '+(appifier.json|package.json)',
            unpackDir: path.join('node_modules', 'electron-widevinecdm', 'widevine'),
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

      let resourcesPath;
      switch (process.platform) {
        case 'darwin':
          resourcesPath = path.join(destPath, 'Contents', 'Resources');
          break;
        case 'win32':
        case 'linux':
          resourcesPath = path.join(destPath, 'resources');
          break;
        default:
          return Promise.reject(new Error('Unknown platform'));
      }

      const appAsarUnpackedPath = path.join(resourcesPath, 'app.asar.unpacked');
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
            return fs.copy(inputIcon, path.join(resourcesPath, 'icon.png'))
              .then(() => {
                // icon png for BrowserWindow's nativeImage
                if (process.platform === 'linux') {
                  return fs.copy(inputIcon, path.join(appAsarUnpackedPath, 'icon.png'));
                }
                return null;
              });
          }

          return null;
        })
        .then(() => appPaths[0]);
    })
    .catch(err => Promise.reject(err));
};

module.exports = {
  createAppAsync,
};
