const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');

const prepareTemplateAsync = () => new Promise((resolve, reject) => {
  const scriptPath = path.join(__dirname, 'forked-script.js');

  const child = fork(scriptPath, [
    '--appVersion',
    app.getVersion(),
    '--templatePath',
    path.join(app.getPath('userData'), 'webcatalog-template'),
    '--platform',
    process.platform,
    '--arch',
    process.arch,
  ], {
    env: {
      ELECTRON_RUN_AS_NODE: 'true',
      ELECTRON_NO_ASAR: 'true',
      // for require('download')
      APPDATA: app.getPath('appData'),
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

module.exports = prepareTemplateAsync;
