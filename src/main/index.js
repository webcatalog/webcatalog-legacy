const { app, BrowserWindow, ipcMain } = require('electron');
const argv = require('yargs-parser')(process.argv.slice(1));
const path = require('path');
const url = require('url');
const settings = require('electron-settings');
const camelCase = require('lodash.camelcase');

const createMenu = require('./libs/createMenu');
const windowStateKeeper = require('./libs/windowStateKeeper');
const checkForUpdate = require('./libs/checkForUpdate');
const setProtocols = require('./libs/setProtocols');
const registerFiltering = require('./libs/adblock/registerFiltering');
const clearBrowsingData = require('./libs/clearBrowsingData');
const showAboutWindow = require('./libs/showAboutWindow');

const isSSB = argv.url !== undefined && argv.id !== undefined;
const isDevelopment = argv.development === 'true';
const isTesting = argv.testing === 'true';

setProtocols();

// for Netflix
if (isSSB) {
  const widewine = require('electron-widevinecdm');
  // only need DRM in webview
  widewine.load(app);
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  const mainWindowState = windowStateKeeper({
    id: isSSB ? argv.id : 'webcatalog',
    defaultWidth: isSSB ? 1280 : 800,
    defaultHeight: isSSB ? 800 : 600,
  });

  const options = {
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 500,
    minHeight: 400,
    title: argv.name || 'WebCatalog',
    titleBarStyle: (process.platform === 'darwin') ? 'hidden' : 'default',
    frame: true,
    icon: process.platform === 'linux' ? `~/.icons/webcatalog/${argv.id}.png` : null,
  };

  mainWindow = new BrowserWindow(options);

  mainWindowState.manage(mainWindow);

  ipcMain.on('show-about-window', () => {
    showAboutWindow();
  });

  if (isSSB) {
    mainWindow.appInfo = {
      id: argv.id,
      name: argv.name,
      url: argv.url,
      userAgent: mainWindow.webContents.getUserAgent().replace(`Electron/${process.versions.electron}`, ''), // make browser think SSB is a browser
      isTesting,
      isDevelopment,
    };

    /* Badge count */
    // support macos
    const setDockBadge = (process.platform === 'darwin') ? app.dock.setBadge : () => {};

    ipcMain.on('badge', (e, badge) => {
      setDockBadge(badge);
    });

    ipcMain.on('clear-browsing-data', () => {
      clearBrowsingData({ appName: argv.name, appId: argv.id });
    });

    const blockAds = settings.get(`behaviors.${camelCase(argv.id)}.blockAds`, false);
    if (blockAds) {
      registerFiltering(argv.id);
    }

    const swipeToNavigate = settings.get(`behaviors.${camelCase(argv.id)}.swipeToNavigate`, true);
    if (swipeToNavigate) {
      mainWindow.on('swipe', (e, direction) => {
        if (direction === 'left') {
          mainWindow.webContents.send('go-back');
        } else if (direction === 'right') {
          mainWindow.webContents.send('go-forward');
        }
      });
    }

    mainWindow.on('focus', () => {
      mainWindow.webContents.send('focus');
    });
  }

  // setup update checking
  checkForUpdate({ mainWindow, isDevelopment, isTesting });

  // Emitted when the close button is clicked.
  mainWindow.on('close', (e) => {
    // keep window running when close button is hit except when quit on last window is turned on
    if (isSSB && process.platform === 'darwin' && !mainWindow.forceClose) {
      const quitOnLastWindow = settings.get(`behaviors.${camelCase(argv.id)}.quitOnLastWindow`, true);
      if (!quitOnLastWindow) {
        e.preventDefault();
        mainWindow.hide();
        return;
      }
    }
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // create menu
  if (!(isDevelopment && !isSSB)) {
    createMenu({
      isDevelopment,
      isSSB,
      appName: argv.name || 'WebCatalog',
      appId: argv.id,
    });
  }

  // load window
  const windowUrl = url.format({
    pathname: path.join(__dirname, 'www', isSSB ? 'ssb.html' : 'store.html'),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(windowUrl);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  } else if (isSSB) {
    const quitOnLastWindow = settings.get(`behaviors.${camelCase(argv.id)}.quitOnLastWindow`, false);
    if (quitOnLastWindow) {
      app.quit();
    }
  }
});

app.on('before-quit', () => {
  // https://github.com/atom/electron/issues/444#issuecomment-76492576
  if (mainWindow) {
    mainWindow.forceClose = true;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow) {
    mainWindow.show();
  } else {
    createWindow();
  }
});
