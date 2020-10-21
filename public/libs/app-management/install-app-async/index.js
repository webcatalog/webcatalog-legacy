/* eslint-disable prefer-destructuring */
const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');
const tmp = require('tmp');
const ws = require('windows-shortcuts');
const fsExtra = require('fs-extra');

const { getPreferences } = require('../../preferences');
const sendToAllWindows = require('../../send-to-all-windows');
const isEngineInstalled = require('../../is-engine-installed');

const getWin32BravePaths = require('../../get-win32-brave-paths');
const getWin32ChromePaths = require('../../get-win32-chrome-paths');
const getWin32VivaldiPaths = require('../../get-win32-vivaldi-paths');
const getWin32EdgePaths = require('../../get-win32-vivaldi-paths');
const getWin32OperaPaths = require('../../get-win32-opera-paths');
const getWin32YandexPaths = require('../../get-win32-yandex-paths');
const getWin32CoccocPaths = require('../../get-win32-coccoc-paths');
const getWin32FirefoxPaths = require('../../get-win32-firefox-paths');

const prepareTemplateAsync = require('../prepare-template-async');
const registryInstaller = require('../registry-installer');

let lastUsedTmpPath = null;

const createShortcutAsync = (shortcutPath, opts) => {
  if (process.platform !== 'win32') {
    return Promise.reject(new Error('Platform is not supported'));
  }

  return new Promise((resolve, reject) => {
    ws.create(shortcutPath, opts, (err) => {
      if (err) { return reject(err); }
      return resolve();
    });
  });
};

const installAppAsync = (
  engine, id, name, url, icon,
) => {
  let v = '0.0.0'; // app version
  let scriptFileName;

  let browserPath;
  if (process.platform === 'win32') {
    if (engine.startsWith('chrome')) {
      browserPath = getWin32ChromePaths()[0];
    } else if (engine.startsWith('brave')) {
      browserPath = getWin32BravePaths()[0];
    } else if (engine.startsWith('vivaldi')) {
      browserPath = getWin32VivaldiPaths()[0];
    } else if (engine.startsWith('edge')) {
      browserPath = getWin32EdgePaths()[0];
    } else if (engine.startsWith('opera')) {
      browserPath = getWin32OperaPaths()[0];
    } else if (engine.startsWith('yandex')) {
      browserPath = getWin32YandexPaths()[0];
    } else if (engine.startsWith('coccoc')) {
      browserPath = getWin32CoccocPaths()[0];
    } else if (engine.startsWith('firefox')) {
      browserPath = getWin32FirefoxPaths()[0];
    }
  }

  const {
    installationPath,
    requireAdmin,
    createDesktopShortcut,
    createStartMenuShortcut,
    registered,
  } = getPreferences();

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
            scriptFileName = 'forked-script-electron-v2.js';
          });
      }

      if (process.platform === 'darwin') {
        // use v2 script on Mac
        scriptFileName = 'forked-script-lite-v2.js';
        v = '2.3.0';
      } else {
        scriptFileName = 'forked-script-lite-v1.js';
        v = '1.1.0';
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
          case 'firefox':
          case 'firefox/tabs': {
            engineName = 'Mozilla Firefox';
            break;
          }
          default: {
            engineName = 'Browser';
          }
        }
        reject(new Error(`${engineName} is not installed.`));
        return;
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
        '--appDataPath',
        app.getPath('appData'),
        '--installationPath',
        installationPath,
        '--requireAdmin',
        requireAdmin.toString(),
        '--username',
        process.env.USER, // required by sudo-prompt,
        '--registered',
        registered,
      ];

      if (url != null) {
        params.push('--url');
        params.push(url);
      }

      if (browserPath) {
        params.push('--browserPath');
        params.push(browserPath);
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

      const scriptPath = path.join(__dirname, scriptFileName)
        .replace('app.asar', 'app.asar.unpacked');
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

        resolve();
      });
    }))
    .then(() => {
      if (process.platform === 'win32') {
        let args;

        if (engine.startsWith('firefox')) {
          if (engine.endsWith('/tabs')) {
            args = `-P "webcatalog-${id}" "${url}"`;
          } else {
            args = `-P "webcatalog-${id}" --ssb="${url}"`;
          }
        } else if (engine !== 'electron') {
          const chromiumDataPath = path.join(app.getPath('home'), '.webcatalog', 'chromium-data', id);
          if (engine.endsWith('/tabs')) {
            args = `--user-data-dir="${chromiumDataPath}" "${url}"`;
          } else {
            args = `--class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}"`;
          }
        }

        const allAppsPath = installationPath.replace('~', app.getPath('home'));
        const finalPath = path.join(allAppsPath, name);
        const finalIconIcoPath = path.join(finalPath, 'resources', 'app.asar.unpacked', 'build', 'icon.ico');
        const exePath = path.join(finalPath, `${name}.exe`);

        const opts = {
          target: engine === 'electron' ? exePath : browserPath,
          args,
          icon: finalIconIcoPath,
        };
        const coreShortcutPath = path.join(finalPath, `${name}.lnk`);
        const startMenuPath = path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps');
        const startMenuShortcutPath = path.join(startMenuPath, `${name}.lnk`);
        const desktopShortcutPath = path.join(app.getPath('desktop'), `${name}.lnk`);

        const p = [createShortcutAsync(coreShortcutPath, opts)];

        if (createDesktopShortcut) {
          p.push(createShortcutAsync(desktopShortcutPath, opts));
        }

        if (createStartMenuShortcut) {
          p.push(fsExtra.ensureDir(startMenuPath)
            .then(() => createShortcutAsync(startMenuShortcutPath, opts)));
        }

        if (engine === 'electron') {
          p.push(registryInstaller.installAsync(`webcatalog-${id}`, name, exePath));
        }

        return Promise.all(p);
      }

      return null;
    })
    .then(() => v);
};

module.exports = installAppAsync;
