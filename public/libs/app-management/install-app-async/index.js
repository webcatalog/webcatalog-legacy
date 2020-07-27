const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');
const tmp = require('tmp');
const semver = require('semver');

const { getPreference } = require('../../preferences');
const sendToAllWindows = require('../../send-to-all-windows');
const isEngineInstalled = require('../../is-engine-installed');

const getWin32BravePaths = require('../../get-win32-brave-paths');
const getWin32ChromePaths = require('../../get-win32-chrome-paths');
const getWin32FirefoxPaths = require('../../get-win32-firefox-paths');
const getWin32VivaldiPaths = require('../../get-win32-vivaldi-paths');
const getWin32EdgePaths = require('../../get-win32-vivaldi-paths');
const getWin32OperaPaths = require('../../get-win32-opera-paths');
const getWin32YandexPaths = require('../../get-win32-yandex-paths');
const getWin32CoccocPaths = require('../../get-win32-coccoc-paths');

const prepareTemplateAsync = require('../prepare-template-async');

let lastUsedTmpPath = null;

const { getPreferences } = require('../../preferences');

const installAppAsync = (
  engine, id, name, url, icon,
) => {
  let v = '0.0.0'; // app version
  let scriptFileName;
  return Promise.resolve()
    .then(() => {
      sendToAllWindows('update-installation-progress', {
        percent: 0,
        desc: null,
      });

      if (engine === 'electron') {
        return prepareTemplateAsync()
          .then((latestTemplateVersion) => {
            v = latestTemplateVersion;
          });
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
          case 'chromium':
          case 'chromium/tabs': {
            engineName = 'Chromium';
            break;
          }
          case 'brave':
          case 'brave/tabs': {
            engineName = 'Brave';
            break;
          }
          case 'vivaldi':
          case 'vivaldi/tabs': {
            engineName = 'Vivaldi';
            break;
          }
          case 'edge':
          case 'edge/tabs': {
            engineName = 'Microsoft Edge';
            break;
          }
          case 'chromeCanary':
          case 'chromeCanary/tabs': {
            engineName = 'Google Chrome Canary';
            break;
          }
          case 'chrome':
          case 'chrome/tabs': {
            engineName = 'Google Chrome';
            break;
          }
          case 'opera':
          case 'opera/tabs': {
            engineName = 'Opera';
            break;
          }
          case 'yandex':
          case 'yandex/tabs': {
            engineName = 'Yandex Browser';
            break;
          }
          case 'coccoc':
          case 'coccoc/tabs': {
            engineName = 'Cốc Cốc';
            break;
          }
          default: {
            engineName = 'Browser';
          }
        }
        reject(new Error(`${engineName} is not installed.`));
        return;
      }

      if (engine === 'electron') {
        if (semver.gte(v, '9.0.0-alpha')) {
          scriptFileName = 'forked-script-electron-v2.js';
        } else {
          scriptFileName = 'forked-script-electron-v1.js';
        }
      } else if (process.platform === 'darwin'
        && engine !== 'firefox'
      ) {
        // use v2 script for Chrome & Chromium-based browsers on Mac
        scriptFileName = 'forked-script-lite-v2.js';
        v = '2.1.0';
      } else {
        scriptFileName = 'forked-script-lite-v1.js';
        v = '1.0.0';
      }

      const params = [
        '--engine',
        engine,
        '--id',
        id,
        '--name',
        name,
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

      if (url != null) {
        params.push('--url');
        params.push(url);
      }

      if (process.platform === 'win32') {
        if (engine === 'firefox') {
          params.push('--browserPath');
          params.push(getWin32FirefoxPaths()[0]);
        } else if (engine.startsWith('chrome')) {
          params.push('--browserPath');
          params.push(getWin32ChromePaths()[0]);
        } else if (engine.startsWith('brave')) {
          params.push('--browserPath');
          params.push(getWin32BravePaths()[0]);
        } else if (engine.startsWith('vivaldi')) {
          params.push('--browserPath');
          params.push(getWin32VivaldiPaths()[0]);
        } else if (engine.startsWith('edge')) {
          params.push('--browserPath');
          params.push(getWin32EdgePaths()[0]);
        } else if (engine.startsWith('opera')) {
          params.push('--browserPath');
          params.push(getWin32OperaPaths()[0]);
        } else if (engine.startsWith('yandex')) {
          params.push('--browserPath');
          params.push(getWin32YandexPaths()[0]);
        } else if (engine.startsWith('coccoc')) {
          params.push('--browserPath');
          params.push(getWin32CoccocPaths()[0]);
        }
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

      const scriptPath = path.join(__dirname, scriptFileName);
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
        if (message && message.progress) {
          sendToAllWindows('update-installation-progress', message.progress);
        } else if (message && message.error) {
          err = new Error(message.error.message);
          err.stack = message.error.stack;
          err.name = message.error.name;
        } else {
          console.log(message); // eslint-disable-line no-console
        }
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

        // installation done
        sendToAllWindows('update-installation-progress', {
          percent: 100,
          desc: null,
        });

        resolve(v);
      });
    }));
};

module.exports = installAppAsync;
