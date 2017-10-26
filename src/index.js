const fs = require('fs-extra');
const packager = require('electron-packager');
const path = require('path');
const tmp = require('tmp');

const createTmpDirAsync = () =>
  new Promise((resolve, reject) => {
    tmp.dir({ unsafeCleanup: true }, (err, dirPath, cleanupCallback) => {
      if (err) {
        return reject(err);
      }

      return resolve({ dirPath, cleanupCallback });
    });
  });

const createAppAsync = (id, name, url, icon, out) => {
  const appDir = path.resolve(__dirname, '..', 'app').replace('app.asar', 'app.asar.unpacked');

  let cleanupCallback;

  return createTmpDirAsync()
    .then(tmpObj =>
      new Promise((resolve, reject) => {
        cleanupCallback = tmpObj.cleanupCallback;

        const options = {
          name,
          icon,
          platform: process.platform,
          dir: appDir,
          out: tmpObj.dirPath,
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
        const destPath = path.resolve(out, binaryFileName);

        return fs.move(
          path.resolve(appPaths[0], binaryFileName),
          destPath,
          { overwrite: true },
        ).then(() => destPath);
      }

      if (process.platform === 'win32' || process.platform === 'linux') {
        const destPath = path.resolve(out, id);

        return fs.move(
          appPaths[0],
          destPath,
          { overwrite: true },
        ).then(() => destPath);
      }

      return Promise.reject(new Error('Unknown platform'));
    })
    .then((destPath) => {
      cleanupCallback();

      let packageJsonPath;
      switch (process.platform) {
        case 'darwin':
          packageJsonPath = path.resolve(destPath, 'Contents', 'Resources', 'app.asar.unpacked', 'package.json');
          break;
        case 'win32':
          packageJsonPath = path.resolve(destPath, 'resources', 'app.asar.unpacked', 'package.json');
          break;
        case 'linux':
          packageJsonPath = path.resolve(destPath, 'app.asar.unpacked', 'package.json');
          break;
        default:
          return Promise.reject(new Error('Unknown platform'));
      }

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
        .then(() => destPath);
    })
    .catch((err) => {
      cleanupCallback();
      return Promise.reject(err);
    });
};

module.exports = createAppAsync;
