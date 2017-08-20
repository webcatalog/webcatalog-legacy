const { app } = require('electron');
const path = require('path');
const fork = require('child_process').fork;

const getAllAppPath = require('../get-all-app-path');

const installAppAsync = ({ id, name, url, icnsIconUrl, icoIconUrl, pngIconUrl }) =>
  new Promise((resolve, reject) => {
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
      resolve();
    });

    child.on('message', (e) => {
      // Receive results from child process
      reject(e);
    });
  });

module.exports = installAppAsync;
