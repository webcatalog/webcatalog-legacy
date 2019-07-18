const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');

const { getPreference } = require('./../../preferences');

const installAppAsync = (id, name, url, icon, mailtoHandler) => new Promise((resolve, reject) => {
  const scriptPath = path.join(__dirname, 'forked-script.js');

  const params = [
    '--id',
    id,
    '--name',
    name,
    '--url',
    url,
    '--icon',
    icon,
    '--homePath',
    app.getPath('home'),
    '--installationPath',
    getPreference('installationPath'),
    '--requireAdmin',
    getPreference('requireAdmin').toString(),
    'username',
    process.env.USER, // required by sudo-prompt
  ];

  if (mailtoHandler && mailtoHandler.length > 0) {
    params.push(
      '--mailtoHandler',
      mailtoHandler,
    );
  }

  const child = fork(scriptPath, params, {
    env: {
      ELECTRON_RUN_AS_NODE: 'true',
      ELECTRON_NO_ASAR: 'true',
      APPDATA: app.getPath('appData'),
    },
  });

  child.on('message', (message) => {
    console.log(message);
  });

  child.on('exit', (code) => {
    if (code === 1) {
      reject(new Error('Forked script failed to run correctly.'));
      return;
    }

    resolve();
  });
});

module.exports = installAppAsync;
