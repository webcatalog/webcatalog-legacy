const { app } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const fs = require('fs-extra');

const { getPreference } = require('../preferences');

const installAppAsync = appObj =>
  fs.readJson(path.join(app.getAppPath(), 'package.json'))
    .then((moleculePackageJson) => {
      const moleculeVersion = moleculePackageJson.dependencies.appifier;
      const shareResources = getPreference('shareResources');

      return new Promise((resolve, reject) => {
        const {
          id, name, url, icon, location,
        } = appObj;

        const scriptPath = path.join(__dirname, 'script.js').replace('app.asar', 'app.asar.unpacked');

        const child = fork(scriptPath, [
          '--id',
          id,
          '--name',
          name,
          '--url',
          url,
          '--icon',
          icon,
          '--destDirPath',
          location,
          '--desktopPath',
          app.getPath('desktop'),
          '--homePath',
          app.getPath('home'),
          '--tempPath',
          app.getPath('temp'),
          '--moleculeVersion',
          moleculeVersion,
          '--shareResources',
          shareResources,
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
      })
        .then(() => {
          const finalizedAppObj = Object.assign({}, appObj, { moleculeVersion });

          return finalizedAppObj;
        });
    });

module.exports = installAppAsync;
