const path = require('path');
const {
  app,
  ipcMain,
  nativeTheme,
  protocol,
  session,
} = require('electron');
const fs = require('fs');
const settings = require('electron-settings');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
const url = require('url');

const { getPreference, getPreferences } = require('./libs/preferences');

// Activate the Sentry Electron SDK as early as possible in every process.
if (!isDev && getPreference('sentry')) {
  // eslint-disable-next-line global-require
  require('./libs/sentry');
}

const { createMenu } = require('./libs/menu');
const sendToAllWindows = require('./libs/send-to-all-windows');
const loadListeners = require('./listeners');

const mainWindow = require('./windows/main');

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
            appId = url.parse(urlStr).path.substring(1);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
          }
          if (appId) {
            mainWindow.send('open-dialog-catalog-app-details', appId);
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
      proxyBypassRules,
      proxyPacScript,
      proxyRules,
      proxyType,
      themeSource,
    } = getPreferences();

    // configure proxy for default session
    if (proxyType === 'rules') {
      session.defaultSession.setProxy({
        proxyRules,
        proxyBypassRules,
      });
    } else if (proxyType === 'pacScript') {
      session.defaultSession.setProxy({
        proxyPacScript,
        proxyBypassRules,
      });
    }

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
