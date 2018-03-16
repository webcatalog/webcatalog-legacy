const { app } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const fs = require('fs-extra');

const getInstallationPath = require('../get-installation-path');

const installAppAsync = appObj =>
  fs.readJson(path.join(app.getAppPath(), 'template', 'package.json'))
    .then((templatePackageJson) => {
      const moleculeVersion = templatePackageJson.version;

      return new Promise((resolve, reject) => {
        const {
          id, name, url, icon,
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
          '--allAppPath',
          getInstallationPath(),
          '--desktopPath',
          app.getPath('desktop'),
          '--homePath',
          app.getPath('home'),
          '--tempPath',
          app.getPath('temp'),
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
      })
        .then(() => {
          const finalizedAppObj = Object.assign({}, appObj, { moleculeVersion });

          return finalizedAppObj;
        });
    });

module.exports = installAppAsync;
