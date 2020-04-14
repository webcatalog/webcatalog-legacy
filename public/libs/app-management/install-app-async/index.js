const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');
const tmp = require('tmp');

const { getPreference } = require('../../preferences');
const isEngineInstalled = require('../../is-engine-installed');

const getWin32BravePaths = require('../../get-win32-brave-paths');
const getWin32ChromePaths = require('../../get-win32-chrome-paths');
const getWin32FirefoxPaths = require('../../get-win32-firefox-paths');
const getWin32VivaldiPaths = require('../../get-win32-vivaldi-paths');
const getWin32EdgePaths = require('../../get-win32-vivaldi-paths');

const prepareTemplateAsync = require('../prepare-template-async');

let lastUsedTmpPath = null;

const { getPreferences } = require('../../preferences');

const getScriptFileName = (engine) => {
  if (engine === 'electron') {
    return 'forked-script-electron.js';
  }

  // use v2 script for Chrome & Chromium-based browsers on Mac
  if (process.platform === 'darwin'
    && engine !== 'firefox'
  ) {
    return 'forked-script-lite-v2.js';
  }

  return 'forked-script-lite-v1.js';
};

const installAppAsync = (
  engine, id, name, url, icon,
) => Promise.resolve()
  .then(() => {
    if (engine === 'electron') {
      return prepareTemplateAsync();
    }
    return null;
  })
  .then(() => new Promise((resolve, reject) => {
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
        case 'vivaldi': {
          engineName = 'Vivaldi';
          break;
        }
        case 'edge': {
          engineName = 'Microsoft Edge';
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

    const scriptPath = path.join(__dirname, getScriptFileName(engine));

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
      '--registered',
      getPreference('registered'),
    ];

    if (process.platform === 'win32' && engine === 'firefox') {
      params.push('--firefoxPath');
      params.push(getWin32FirefoxPaths()[0]);
    }

    if (process.platform === 'win32' && engine === 'chrome') {
      params.push('--chromePath');
      params.push(getWin32ChromePaths()[0]);
    }

    if (process.platform === 'win32' && engine === 'brave') {
      params.push('--bravePath');
      params.push(getWin32BravePaths()[0]);
    }

    if (process.platform === 'win32' && engine === 'vivaldi') {
      params.push('--vivaldiPath');
      params.push(getWin32VivaldiPaths()[0]);
    }

    if (process.platform === 'win32' && engine === 'edge') {
      params.push('--edgePath');
      params.push(getWin32EdgePaths()[0]);
    }

    let tmpPath = null;
    if (engine === 'electron') {
      params.push(
        '--appPath',
        path.join(app.getPath('userData'), 'webcatalog-template'),
      );

      tmpPath = lastUsedTmpPath || tmp.dirSync().name;
      params.push(
        '--tmpPath',
        tmpPath,
      );
    }

    const {
      proxyPacScript,
      proxyRules,
      proxyType,
    } = getPreferences();

    const child = fork(scriptPath, params, {
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
        lastUsedTmpPath = null;

        // force reextracting template code to avoid bugs related to corrupted files
        if (engine === 'electron') {
          global.forceExtract = true;
        }

        reject(err || new Error('Forked script failed to run correctly.'));
        return;
      }
      if (tmpPath) {
        lastUsedTmpPath = tmpPath;
      }
      resolve();
    });
  }));

module.exports = installAppAsync;
