const exec = require('child_process').exec;
const fs = require('fs-extra');
const packager = require('electron-packager');
const path = require('path');
const tmp = require('tmp');

const execAsync = command =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(stdout, stderr);
    });
  });

const copyAsync = (src, dist) =>
  execAsync(`mkdir -p "${dist}"`)
    // eslint-disable-next-line
    .then(() => console.log(`cp -r "${src}"/* ${dist}`))
    .then(() => execAsync(`cp -r "${src}"/* ${dist}`));

const moveAsync = (src, dist) =>
  execAsync(`mkdir -p "${dist}"`)
    // eslint-disable-next-line
    .then(() => console.log(`mv "${src}"/* "${dist}"`))
    .then(() => execAsync(`mv "${src}"/* "${dist}"`));

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

      return copyAsync(appDir, tmpDir)
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

              return moveAsync(
                path.resolve(appPaths[0], binaryFileName),
                path.resolve(out, binaryFileName),
              );
            });
        });
    });

module.exports = createAppAsync;
