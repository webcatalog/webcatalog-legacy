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
    .then(() => createIconAsync(inputIcon, tmpDir))
    .then(icon =>
      new Promise((resolve, reject) => {
        const options = {
          name,
          icon,
          platform: process.platform,
          dir: appDir,
          out: tmpDir,
          overwrite: true,
          prune: false,
          asar: {
            unpack: 'package.json',
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
        const destPath = path.join(out, binaryFileName);

        return fs.move(
          path.join(appPaths[0], binaryFileName),
          destPath,
          { overwrite: true },
        ).then(() => destPath);
      }

      if (process.platform === 'win32' || process.platform === 'linux') {
        const destPath = path.join(out, id);

        return fs.move(
          appPaths[0],
          destPath,
          { overwrite: true },
        ).then(() => destPath);
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

      const packageJsonPath = path.join(resourcesPath, 'app.asar.unpacked', 'package.json');
      const appAsarUnpackedPath = path.join(resourcesPath, 'app.asar.unpacked');

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

module.exports = createAppAsync;
