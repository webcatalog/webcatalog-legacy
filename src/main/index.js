const { app, BrowserWindow, ipcMain } = require('electron');
const argv = require('yargs-parser')(process.argv.slice(1));
const path = require('path');
const url = require('url');
const settings = require('electron-settings');
const camelCase = require('lodash.camelcase');

const createMenu = require('./libs/createMenu');
const windowStateKeeper = require('./libs/windowStateKeeper');
const checkForUpdate = require('./libs/checkForUpdate');
const sendMessageToWindow = require('./libs/sendMessageToWindow');
const setProtocols = require('./libs/setProtocols');
const registerFiltering = require('./libs/adblock/registerFiltering');

const isSSB = (typeof argv.url === 'string' && typeof argv.id === 'string');
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

function createWindow() {
  if (isSSB) {
    // set default settings
    const defaultSettings = { behaviors: {} };
    defaultSettings.behaviors[camelCase(argv.id)] = {
      swipeToNavigate: true,
      rememberLastPage: false,
      quitOnLastWindow: false,
      blockAds: false,
      customHome: null,
    };

    settings.defaults(defaultSettings);
    settings.applyDefaultsSync();
  }

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
  };

  mainWindow = new BrowserWindow(options);

  mainWindowState.manage(mainWindow);

  const windowUrl = url.format({
    pathname: path.join(__dirname, 'www', isSSB ? 'ssb.html' : 'store.html'),
    protocol: 'file:',
    slashes: true,
  });

  if (isSSB) {
    mainWindow.appInfo = {
      id: argv.id,
      name: argv.name,
      url: argv.url,
      userAgent: mainWindow.webContents.getUserAgent().replace(`Electron/${process.versions.electron}`, `WebCatalog/${app.getVersion()}`),
      isTesting,
      isDevelopment,
    };

    // ablocker
    settings.get(`behaviors.${camelCase(argv.id)}.blockAds`)
      .then((blockAds) => {
        if (blockAds) {
          registerFiltering(argv.id);
        }
      });

    /* Badge count */
    // do nothing for setDockBadge if not OSX
    const setDockBadge = (process.platform === 'darwin') ? app.dock.setBadge : () => {};

    ipcMain.on('badge', (e, badge) => {
      setDockBadge(badge);
    });

    mainWindow.on('focus', () => {
      setDockBadge('');
    });
  }

  mainWindow.loadURL(windowUrl);

  const log = (message) => {
    sendMessageToWindow('log', message);
  };

  if (!(isDevelopment && !isSSB)) {
    createMenu({
      isDevelopment,
      isSSB,
      appName: argv.name || 'WebCatalog',
      appId: argv.id,
      log,
    });
  }

  checkForUpdate({ mainWindow, log, isSSB, isDevelopment, isTesting });

  if (isSSB) {
    settings.get(`behaviors.${camelCase(argv.id)}.swipeToNavigate`)
      .then((swipeToNavigate) => {
        if (swipeToNavigate) {
          mainWindow.on('swipe', (e, direction) => {
            if (direction === 'left') {
              mainWindow.webContents.send('go-back');
            } else if (direction === 'right') {
              mainWindow.webContents.send('go-forward');
            }
          });
        }
      })
      .catch((err) => {
        sendMessageToWindow('log', err);
      });
  }

  // Emitted when the close button is clicked.
  mainWindow.on('close', (e) => {
    // keep window running when close button is hit except when quit on last window is turned on
    if (process.platform === 'darwin' && isSSB) {
      if (mainWindow.forceClose) return;
      e.preventDefault();
      settings.get(`behaviors.${camelCase(argv.id)}.quitOnLastWindow`)
        .then((quitOnLastWindow) => {
          if (quitOnLastWindow) {
            app.quit();
          } else {
            mainWindow.hide();
          }
        })
        .catch((err) => {
          sendMessageToWindow('log', err);
        });

      return;
    }
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


app.on('before-quit', () => {
  // https://github.com/atom/electron/issues/444#issuecomment-76492576 does not work,
  if (mainWindow !== null) {
    mainWindow.forceClose = true;
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});
