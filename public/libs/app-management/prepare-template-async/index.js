const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');

const { getPreferences } = require('../../preferences');

const prepareTemplateAsync = () => new Promise((resolve, reject) => {
  const scriptPath = path.join(__dirname, 'forked-script.js');

  const {
    proxyPacScript,
    proxyRules,
    proxyType,
  } = getPreferences();

  const child = fork(scriptPath, [
    '--appVersion',
    app.getVersion(),
    '--templatePath',
    path.join(app.getPath('userData'), 'webcatalog-template'),
    '--templateZipPath',
    path.join(app.getPath('userData'), 'webcatalog-template.zip'),
    '--platform',
    process.platform,
    '--arch',
    process.arch,
  ], {
    env: {
      ELECTRON_RUN_AS_NODE: 'true',
      ELECTRON_NO_ASAR: 'true',
      APPDATA: app.getPath('appData'),
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

module.exports = prepareTemplateAsync;
