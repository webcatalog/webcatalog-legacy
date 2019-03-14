// eslint-disable-next-line import/no-extraneous-dependencies
const { app, protocol } = require('electron');
const path = require('path');

const loadListeners = require('./listeners');

const mainWindow = require('./windows/main');
const openUrlWithWindow = require('./windows/open-url-with');

const createMenu = require('./libs/create-menu');
const { addView } = require('./libs/views');
const { checkForUpdates } = require('./libs/updater');
const { getPreference } = require('./libs/preferences');
const { getWorkspaces } = require('./libs/workspaces');
const sentrySession = require('./libs/sentry-session');

const appJson = require('./app.json');

const gotTheLock = app.requestSingleInstanceLock();

app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  const win = mainWindow.get();
  if (win != null) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

if (!gotTheLock) {
  // eslint-disable-next-line
  app.quit();
} else {
  protocol.registerStandardSchemes(['http']);
  protocol.registerStandardSchemes(['https']);
  protocol.registerStandardSchemes(['mailto']);

  loadListeners();

  const WIDEVINE_PATH = path.join(__dirname, 'plugins', 'WidevineCdm', '_platform_specific', 'mac_x64').replace('app.asar', 'app.asar.unpacked');
  const WIDEVINE_VERSION = '4.10.1192.0';
  app.commandLine.appendSwitch('widevine-cdm-path', WIDEVINE_PATH);
  app.commandLine.appendSwitch('widevine-cdm-version', WIDEVINE_VERSION);

  const commonInit = () => {
    mainWindow.create();

    createMenu();

    const workspaceObjects = getWorkspaces();

    Object.keys(workspaceObjects).forEach((id) => {
      const workspace = workspaceObjects[id];
      addView(mainWindow.get(), workspace);
    });
  };

  app.on('ready', () => {
    // init as soon as possible
    sentrySession.init();

    global.appJson = appJson;

    global.showSidebar = getPreference('sidebar');

    commonInit();

    checkForUpdates(true);
  });

  app.on('before-quit', () => {
    // https://github.com/atom/electron/issues/444#issuecomment-76492576
    if (process.platform === 'darwin') {
      const win = mainWindow.get();
      if (win) {
        win.forceClose = true;
      }
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    const win = mainWindow.get();
    if (win == null) {
      commonInit();
    } else {
      mainWindow.show();
    }
  });

  app.on('open-url', (e, url) => {
    e.preventDefault();

    app.whenReady()
      .then(() => openUrlWithWindow.show(url));
  });
}
