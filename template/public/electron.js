// eslint-disable-next-line import/no-extraneous-dependencies
const { app, protocol, ipcMain } = require('electron');

const loadListeners = require('./listeners');

const authWindow = require('./windows/auth');
const mainWindow = require('./windows/main');
const openUrlWithWindow = require('./windows/open-url-with');

const createMenu = require('./libs/create-menu');
const { addView } = require('./libs/views');
const { checkForUpdates } = require('./libs/updater');
const { getPreference } = require('./libs/preferences');
const { getWorkspaces } = require('./libs/workspaces');

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
  protocol.registerSchemesAsPrivileged([
    { scheme: 'http', privileges: { standard: true } },
    { scheme: 'https', privileges: { standard: true } },
    { scheme: 'mailto', privileges: { standard: true } },
  ]);

  loadListeners();

  const commonInit = () => {
    mainWindow.createAsync()
      .then(() => {
        createMenu();

        const workspaceObjects = getWorkspaces();

        Object.keys(workspaceObjects).forEach((id) => {
          const workspace = workspaceObjects[id];
          addView(mainWindow.get(), workspace);
        });
      });
  };

  app.on('ready', () => {
    global.appJson = appJson;

    global.attachToMenubar = getPreference('attachToMenubar');
    global.showSidebar = getPreference('sidebar');
    global.showNavigationBar = getPreference('navigationBar');

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

  app.on('login', (e, webContents, request, authInfo, callback) => {
    e.preventDefault();
    const sessId = String(Date.now());
    authWindow.show(sessId, request.url);

    const listener = (ee, id, success, username, password) => {
      if (id !== sessId) return;

      if (success) {
        callback(username, password);
      } else {
        callback();
      }

      ipcMain.removeListener('continue-auth', listener);
    };

    ipcMain.on('continue-auth', listener);
  });
}
