const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');
const tmp = require('tmp');

const { getPreference } = require('./../../preferences');
const isEngineInstalled = require('../../is-engine-installed');

const getWin32BravePaths = require('../../get-win32-brave-paths');
const getWin32ChromePaths = require('../../get-win32-chrome-paths');
const getWin32FirefoxPaths = require('../../get-win32-firefox-paths');

let lastUsedTmpPath = null;

const installAppAsync = (
  engine, id, name, url, icon, mailtoHandler,
) => new Promise((resolve, reject) => {
  if (!isEngineInstalled(engine)) {
    let engineName;
    switch (engine) {
      case 'electron': {
        engineName = 'Electron';
        break;
      }
      case 'firefox': {
        engineName = 'Mozilla Firefox';
        break;
      }
      case 'chromium': {
        engineName = 'Chromium';
        break;
      }
      case 'brave': {
        engineName = 'Brave';
        break;
      }
      default:
      case 'chrome': {
        engineName = 'Google Chrome';
        break;
      }
    }
    reject(new Error(`${engineName} is not installed.`));
    return;
  }

  const scriptPath = path.join(__dirname, engine === 'electron' ? 'forked-script-electron.js' : 'forked-script-lite.js');

  const params = [
    '--engine',
    engine,
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
    '--desktopPath',
    app.getPath('desktop'),
    '--installationPath',
    getPreference('installationPath'),
    '--requireAdmin',
    getPreference('requireAdmin').toString(),
    '--username',
    process.env.USER, // required by sudo-prompt,
    '--createDesktopShortcut',
    getPreference('createDesktopShortcut'),
    '--createStartMenuShortcut',
    getPreference('createStartMenuShortcut'),
  ];

  if (engine === 'firefox') {
    params.push('--firefoxPath');
    params.push(getWin32FirefoxPaths()[0]);
  }

  if (engine === 'chrome') {
    params.push('--chromePath');
    params.push(getWin32ChromePaths()[0]);
  }

  if (engine === 'brave') {
    params.push('--bravePath');
    params.push(getWin32BravePaths()[0]);
  }

  if (mailtoHandler && mailtoHandler.length > 0) {
    params.push(
      '--mailtoHandler',
      mailtoHandler,
    );
  }

  let tmpPath = null;
  if (engine === 'electron') {
    tmpPath = lastUsedTmpPath || tmp.dirSync().name;
    params.push(
      '--tmpPath',
      tmpPath,
    );
  }

  const child = fork(scriptPath, params, {
    env: {
      ELECTRON_RUN_AS_NODE: 'true',
      ELECTRON_NO_ASAR: 'true',
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
    console.log(message);
  });

  child.on('exit', (code) => {
    if (code === 1) {
      lastUsedTmpPath = null;
      reject(err || new Error('Forked script failed to run correctly.'));
      return;
    }
    if (tmpPath) {
      lastUsedTmpPath = tmpPath;
    }
    resolve();
  });
});

module.exports = installAppAsync;
