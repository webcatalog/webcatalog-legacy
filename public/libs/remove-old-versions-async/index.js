const { app } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const { fork } = require('child_process');

const removeVersionAsync = moleculeVersion =>
  new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'script.js').replace('app.asar', 'app.asar.unpacked');

    const child = fork(scriptPath, [
      '--homePath',
      app.getPath('home'),
      '--moleculeVersion',
      moleculeVersion,
    ], {
      env: {
        ELECTRON_RUN_AS_NODE: 'true',
        ELECTRON_NO_ASAR: 'true',
      },
    });

    child.on('message', (errStr) => {
      const errObj = JSON.parse(errStr);

      const e = new Error(errObj.message);
      e.stack = errObj.stack;

      reject(e);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      }
    });
  });

const removeOldVersionsAsync = (installedApps) => {
  const inUseVersions = installedApps
    .map(a => a.moleculeVersion)
    .filter((elem, index, self) => index === self.indexOf(elem));

  const versionsPath = path.join(app.getPath('home'), '.webcatalog', 'versions');

  return fs.pathExists(versionsPath)
    .then((exists) => {
      if (exists) {
        return fs.readdir(versionsPath)
          .then((dirs) => {
            const p = [];

            dirs.forEach((dir) => {
              if (inUseVersions.indexOf(dir) < 0) {
                p.push(removeVersionAsync(dir));
              }
            });

            return Promise.all(p);
          });
      }

      return null;
    });
};

module.exports = removeOldVersionsAsync;
