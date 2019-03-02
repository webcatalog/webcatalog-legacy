const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');

const sentrySession = require('./../../sentry-session');

const uninstallAppAsync = (id, name) => new Promise((resolve, reject) => {
  const scriptPath = path.join(__dirname, 'forked-script.js');

  const child = fork(scriptPath, [
    '--id',
    id,
    '--name',
    name,
    '--homePath',
    app.getPath('home'),
  ], {
    env: {
      ELECTRON_RUN_AS_NODE: 'true',
      ELECTRON_NO_ASAR: 'true',
    },
  });

  child.on('message', (message) => {
    console.log(message);
    if (message instanceof Error) {
      const s = sentrySession.get();
      if (s) s.captureException(message);
    }
  });

  child.on('exit', (code) => {
    if (code === 1) {
      reject(new Error('Forked script failed to run correctly.'));
      return;
    }

    resolve();
  });
});

module.exports = uninstallAppAsync;
