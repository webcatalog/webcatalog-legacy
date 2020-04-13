const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');

const { getPreferences } = require('../../preferences');

const uninstallAppAsync = (id, name) => new Promise((resolve, reject) => {
  const scriptPath = path.join(__dirname, 'forked-script.js');

  const {
    installationPath,
    proxyPacScript,
    proxyRules,
    proxyType,
    requireAdmin,
  } = getPreferences();

  const child = fork(scriptPath, [
    '--id',
    id,
    '--name',
    name,
    '--homePath',
    app.getPath('home'),
    '--appDataPath',
    app.getPath('appData'),
    '--desktopPath',
    app.getPath('desktop'),
    '--installationPath',
    installationPath,
    '--requireAdmin',
    requireAdmin.toString(),
    'username',
    process.env.USER, // required by sudo-prompt
  ], {
    env: {
      ELECTRON_RUN_AS_NODE: 'true',
      ELECTRON_NO_ASAR: 'true',
      PROXY_PAC_SCRIPT: proxyPacScript,
      PROXY_RULES: proxyRules,
      PROXY_TYPE: proxyType,
    },
  });

  let err = null;
  child.on('message', (message) => {
    if (message && message.error) {
      err = new Error(message.error.message);
      err.stack = message.error.stack;
      err.name = message.error.name;
    }
    console.log(message); // eslint-disable-line no-console
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
