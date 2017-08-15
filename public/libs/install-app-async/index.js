const { app } = require('electron');
const path = require('path');
const fork = require('child_process').fork;

const installAppAsync = ({ id, name, url, icnsIconUrl }) =>
  new Promise((resolve, reject) => {
    const destPath = path.join(app.getPath('home'), 'Applications', 'WebCatalog Apps');
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
      '--destPath',
      destPath,
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
