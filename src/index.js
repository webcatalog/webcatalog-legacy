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
      const appDir = path.resolve(__dirname, '..', 'app');

      return fs.copy(appDir, tmpDir)
        .then(() => {
          const packageJsonPath = path.resolve(tmpDir, 'package.json');
          return fs.readJson(packageJsonPath)
            .then((packageJsonTemplate) => {
              const packageJson = Object.assign({}, packageJsonTemplate, {
                name: id,
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
              let binaryFileName;
              switch (process.platform) {
                default: {
                  binaryFileName = `${name}.app`;
                }
              }

              return fs.move(
                path.resolve(appPaths[0], binaryFileName),
                path.resolve(out, binaryFileName),
                { overwrite: true },
              );
            });
        });
    });

module.exports = createAppAsync;
