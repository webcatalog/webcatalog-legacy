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
const electronRemote = require('@electron/remote/main');

const settings = require('electron-settings');

settings.configure({
  fileName: 'Settings', // backward compatible with electron-settings@3
});

const { autoUpdater } = require('electron-updater');

electronRemote.initialize();

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

  loadListeners();
  loadInvokers();

  app.on('ready', () => {
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

        const win = mainWindow.get();
        mainWindow.get().on('focus', () => {
          win.send('log-focus');
        });

        if (!privacyConsentAsked) {
          // wait for 5s before showing this
          // the window needs some time to focus
          // https://github.com/webcatalog/webcatalog-app/issues/1461
          setTimeout(() => {
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
          }, 5000);
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

  app.on('second-instance', () => {
    const win = mainWindow.get();
    if (win != null) {
      if (win.isMinimized()) win.restore();
      win.show();
    }
  });
}
