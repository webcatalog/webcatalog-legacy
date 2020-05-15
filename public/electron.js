const path = require('path');
const {
  app,
  session,
  nativeTheme,
} = require('electron');
const fs = require('fs');
const settings = require('electron-settings');
const { autoUpdater } = require('electron-updater');

const createMenu = require('./libs/create-menu');
const sendToAllWindows = require('./libs/send-to-all-windows');
const { getPreference, getPreferences } = require('./libs/preferences');
const loadListeners = require('./listeners');

const mainWindow = require('./windows/main');

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

  app.on('ready', () => {
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
    app.whenReady()
      .then(() => mainWindow.show());
  });
}
