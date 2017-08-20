const { app } = require('electron');
const path = require('path');
const fork = require('child_process').fork;
const fs = require('fs-extra');

const getAllAppPath = require('../get-all-app-path');

const installAppAsync = appObj =>
  new Promise((resolve, reject) => {
    const { id, name, url, icnsIconUrl, icoIconUrl, pngIconUrl } = appObj;

    const destPath = getAllAppPath();
    const scriptPath = path.join(__dirname, 'script.js').replace('app.asar', 'app.asar.unpacked');

    const child = fork(scriptPath, [
      '--id',
      id,
      '--name',
      name,
      '--url',
      url,
      '--icnsIconUrl',
      icnsIconUrl,
      '--icoIconUrl',
      icoIconUrl,
      '--pngIconUrl',
      pngIconUrl,
      '--destPath',
      destPath,
      '--desktopPath',
      app.getPath('desktop'),
      '--homePath',
      app.getPath('home'),
    ], {
      env: {
        ELECTRON_RUN_AS_NODE: 'true',
        ELECTRON_NO_ASAR: 'true',
      },
    });

    child.on('exit', () => {
      // get current molecule version
      fs.readJson(path.join(app.getAppPath(), 'package.json'))
        .then((packageJson) => {
          const finalizedAppObj = Object.assign({}, appObj, {
            moleculeVersion: packageJson.dependencies['@webcatalog/molecule'],
          });
          resolve(finalizedAppObj);
        })
        .catch(reject);
    });

    child.on('message', (e) => {
      // Receive results from child process
      reject(e);
    });
  });

module.exports = installAppAsync;
