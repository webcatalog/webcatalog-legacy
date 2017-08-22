const fs = require('fs-extra');
const packager = require('electron-packager');
const path = require('path');
const tmp = require('tmp');

const createTmpDirAsync = () =>
  new Promise((resolve, reject) => {
    tmp.dir((err, dirPath) => {
      if (err) {
        return reject(err);
      }

      return resolve(dirPath);
    });
  });

const createAppAsync = (id, name, url, icon, out) =>
  createTmpDirAsync()
    .then((tmpDir) => {
      const appDir = path.resolve(__dirname, '..', 'app').replace('app.asar', 'app.asar.unpacked');

      return fs.copy(appDir, tmpDir)
        .then(() => {
          const packageJsonPath = path.resolve(tmpDir, 'package.json');
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
            .then(() => createTmpDirAsync())
            .then(outTmpDir =>
              new Promise((resolve, reject) => {
                const options = {
                  name,
                  icon,
                  platform: process.platform,
                  dir: tmpDir,
                  out: outTmpDir,
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
                )
                  .then(() => destPath);
              }

              if (process.platform === 'win32' || process.platform === 'linux') {
                const destPath = path.resolve(out, id);

                return fs.move(
                  appPaths[0],
                  destPath,
                  { overwrite: true },
                )
                  .then(() => destPath);
              }

              return Promise.reject(new Error('Unknown platform'));
            });
        });
    });

module.exports = createAppAsync;
