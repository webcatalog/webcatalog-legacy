const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');

const { getPreference } = require('./../../preferences');

const uninstallAppAsync = (id, name) => new Promise((resolve, reject) => {
  const scriptPath = path.join(__dirname, 'forked-script.js');

  const child = fork(scriptPath, [
    '--id',
    id,
    '--name',
    name,
    '--homePath',
    app.getPath('home'),
    '--desktopPath',
    app.getPath('desktop'),
    '--installationPath',
    getPreference('installationPath'),
    '--requireAdmin',
    getPreference('requireAdmin').toString(),
    'username',
    process.env.USER, // required by sudo-prompt
  ], {
    env: {
      ELECTRON_RUN_AS_NODE: 'true',
      ELECTRON_NO_ASAR: 'true',
    },
  });

  let err = null;
  child.on('message', (message) => {
    if (message && message.error) {
      err = new Error(message.error.message);
      err.stack = message.error.stack;
      err.name = message.error.name;
    }
    console.log(message);
  });

  child.on('exit', (code) => {
    if (code === 1) {
      reject(err || new Error('Forked script failed to run correctly.'));
      return;
    }

    resolve();
  });
});

module.exports = uninstallAppAsync;
