const path = require('path');
const {
  app,
  session,
  nativeTheme,
} = require('electron');
const { autoUpdater } = require('electron-updater');

const createMenu = require('./libs/create-menu');
const sendToAllWindows = require('./libs/send-to-all-windows');
const { getPreferences } = require('./libs/preferences');
const loadListeners = require('./listeners');

const mainWindow = require('./windows/main');

const packageJson = require('../package.json');

require('./libs/updater');

// see https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = true;

const gotTheLock = app.requestSingleInstanceLock();

app.on('second-instance', () => {
  const win = mainWindow.get();
  if (win != null) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

if (!gotTheLock) {
  app.quit();
} else {
  loadListeners();

  app.on('ready', () => {
    global.templateVersion = packageJson.templateVersion;
    global.defaultIcon = path.join(app.getAppPath(), 'default-icon.png');

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

    mainWindow.createAsync();
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
    mainWindow.show();
  });
}
