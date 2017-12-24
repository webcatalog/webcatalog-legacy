const fs = require('fs-extra');
const packager = require('electron-packager');
const path = require('path');
const tmp = require('tmp');

const createIconAsync = require('./create-icon-async');

const createAppAsync = (
  id = 'molecule',
  name = 'Molecule',
  url = 'https://webcatalog.io',
  inputIcon,
  out = '.',
) => {
  const appDir = path.resolve(__dirname, '..', 'app').replace('app.asar', 'app.asar.unpacked');
  let tmpDir;

  return Promise.resolve()
    .then(() => {
      const tmpObj = tmp.dirSync();
      tmpDir = tmpObj.name;
    })
    .then(() => createIconAsync(inputIcon, tmpDir))
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
      }),
    )
    .then((appPaths) => {
      if (process.platform === 'darwin') {
        const binaryFileName = `${name}.app`;
        return path.join(appPaths[0], binaryFileName);
      }

      if (process.platform === 'win32' || process.platform === 'linux') {
        return appPaths[0];
      }

      return Promise.reject(new Error('Unknown platform'));
    })
    .then((destPath) => {
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
      const appifierJsonPath = path.join(resourcesPath, 'app.asar.unpacked', 'appifier.json');

      return fs.readJson(appifierJsonPath)
        .then((appifierJsonTemplate) => {
          const appifierJson = Object.assign({}, appifierJsonTemplate, {
            id,
            name,
            url,
          });
          return fs.writeJson(appifierJsonPath, appifierJson);
        })
        .then(() => fs.copy(inputIcon, path.join(resourcesPath, 'icon.png')))
        .then(() => {
          // icon png for BrowserWindow's nativeImage
          if (process.platform === 'linux') {
            return fs.copy(inputIcon, path.join(appAsarUnpackedPath, 'icon.png'));
          }
          return null;
        })
        .then(() => destPath);
    })
    .catch(err => Promise.reject(err));
};

module.exports = {
  createAppAsync,
};
