/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
require('source-map-support').install();
const path = require('path');
const {
  app,
  dialog,
  ipcMain,
  nativeTheme,
  protocol,
} = require('electron');
const fs = require('fs');

const settings = require('electron-settings');

settings.configure({
  fileName: 'Settings', // backward compatible with electron-settings@3
});

const { autoUpdater } = require('electron-updater');

const {
  getPreference,
  getPreferences,
  setPreference,
} = require('./libs/preferences');

// Activate the Sentry Electron SDK as early as possible in every process.
if (process.env.NODE_ENV === 'production' && getPreference('sentry')) {
  // eslint-disable-next-line global-require
  require('./libs/sentry');
}

const { createMenu } = require('./libs/menu');
const sendToAllWindows = require('./libs/send-to-all-windows');
const loadListeners = require('./libs/listeners').load;
const loadInvokers = require('./libs/invokers').load;
const initAuthJsonWatcher = require('./libs/auth-json-watcher').init;

const mainWindow = require('./libs/windows/main');

require('./libs/updater');

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // make sure "Settings" file exists
  // if not, ignore this chunk of code
  // as using electron-settings before app.on('ready') and "Settings" is created
  // would return error
  // https://github.com/nathanbuchar/electron-settings/issues/111
  if (fs.existsSync(settings.file())) {
    const useHardwareAcceleration = getPreference('useHardwareAcceleration');
    if (!useHardwareAcceleration) {
      app.disableHardwareAcceleration();
    }
  }

  // Register protocol
  app.setAsDefaultProtocolClient('webcatalog');

  loadListeners();
  loadInvokers();

  // mock app.whenReady
  let trulyReady = false;
  ipcMain.once('truly-ready', () => { trulyReady = true; });
  const whenTrulyReady = () => {
    if (trulyReady) return Promise.resolve();
    return new Promise((resolve) => {
      ipcMain.once('truly-ready', () => {
        trulyReady = true;
        resolve();
      });
    });
  };

  const handleOpenUrl = (urlStr) => {
    whenTrulyReady()
      .then(() => {
        if (urlStr.startsWith('webcatalog://catalog/')) {
          let appId;
          try {
            appId = urlStr.replace('webcatalog://catalog/', '');
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
          }
          if (appId) {
            mainWindow.send('open-dialog-catalog-app-details', appId);
          }
        } else if (urlStr.startsWith('webcatalog://sign-in-with-token/')) {
          let token;
          try {
            token = urlStr.replace('webcatalog://sign-in-with-token/', '');
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
          }
          if (token) {
            mainWindow.send('sign-in-with-token', token);
          }
        }
      });
  };

  const handleArgv = (argv) => {
    if (argv.length <= 1) return;
    const urlStr = argv.find((a) => a.startsWith('webcatalog:'));
    if (urlStr) {
      handleOpenUrl(urlStr);
    }
  };

  app.on('ready', () => {
    initAuthJsonWatcher();

    // https://github.com/electron/electron/issues/23757
    protocol.registerFileProtocol('file', (request, callback) => {
      const pathname = decodeURI(request.url.replace('file:///', ''));
      callback(pathname);
    });

    global.defaultIcon = path.join(
      app.getAppPath(),
      'default-app-icons',
      // use unplated icon on Windows
      process.platform === 'win32' ? 'default-icon-unplated.png' : 'default-icon.png',
    ).replace('app.asar', 'app.asar.unpacked');

    const {
      allowPrerelease,
      themeSource,
      privacyConsentAsked,
      useSystemTitleBar,
    } = getPreferences();

    global.useSystemTitleBar = useSystemTitleBar;

    nativeTheme.themeSource = themeSource;

    mainWindow.createAsync()
      .then(() => {
        // trigger whenFullyReady
        ipcMain.emit('truly-ready');

        // handle protocols on Windows & Linux
        // on macOS, use 'open-url' event
        if (process.platform !== 'darwin') {
          handleArgv(process.argv);
        }

        const win = mainWindow.get();
        mainWindow.get().on('focus', () => {
          win.send('log-focus');
        });

        if (!privacyConsentAsked) {
          dialog.showMessageBox(mainWindow.get(), {
            type: 'question',
            buttons: ['Allow', 'Don\'t Allow'],
            message: 'Can we collect anonymous usage statistics and crash reports?',
            detail: 'The data helps us improve and optimize the product. You can change your decision at any time in the app’s preferences.',
            cancelId: 1,
            defaultId: 0,
          }).then(({ response }) => {
            setPreference('privacyConsentAsked', true);
            if (response === 0) {
              setPreference('sentry', true);
              setPreference('telemetry', true);
            } else {
              setPreference('sentry', false);
              setPreference('telemetry', false);
            }
          }).catch(console.log); // eslint-disable-line
        }
      });

    createMenu();

    nativeTheme.addListener('updated', () => {
      sendToAllWindows('native-theme-updated');
    });

    autoUpdater.allowPrerelease = allowPrerelease;
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    app.whenReady()
      .then(() => mainWindow.show());
  });

  app.on('open-url', (e, urlStr) => {
    e.preventDefault();

    handleOpenUrl(urlStr);
  });

  app.on('second-instance', (e, argv) => {
    const win = mainWindow.get();
    if (win != null) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }

    // handle protocols on Windows & Linux
    // on macOS, use 'open-url' event
    if (process.platform !== 'darwin') {
      handleArgv(argv);
    }
  });
}
