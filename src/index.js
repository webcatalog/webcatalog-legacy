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

const createAppAsync = (id, name, url, icon, out) =>
  createTmpDirAsync()
    .then((tmpObj) => {
      const appDir = path.resolve(__dirname, '..', 'app').replace('app.asar', 'app.asar.unpacked');
      const tmpCodeDir = path.resolve(tmpObj.dirPath, 'code');
      const tmpDistDir = path.resolve(tmpObj.dirPath, 'dist');

      return fs.ensureDir(tmpCodeDir)
        .then(() => fs.copy(appDir, tmpCodeDir))
        .then(() => {
          const packageJsonPath = path.resolve(tmpCodeDir, 'package.json');
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
            .then(() => fs.ensureDir(tmpDistDir))
            .then(() =>
              new Promise((resolve, reject) => {
                const options = {
                  name,
                  icon,
                  platform: process.platform,
                  dir: tmpCodeDir,
                  out: tmpDistDir,
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
            });
        })
        .then((destPath) => {
          tmpObj.cleanupCallback();
          return destPath;
        });
    });

module.exports = createAppAsync;
