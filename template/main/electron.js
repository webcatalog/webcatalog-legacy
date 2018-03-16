// eslint-disable-next-line import/no-extraneous-dependencies
const {
  app,
  BrowserWindow,
  session,
} = require('electron');
const path = require('path');

const isDev = require('electron-is-dev');
const windowStateKeeper = require('electron-window-state');

const loadListeners = require('./listeners');
const createMenu = require('./libs/create-menu');

const { getPreferences } = require('./libs/preferences');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// ensure only one instance is running.
const isSecondInstance = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (isSecondInstance) {
  app.exit();
}

loadListeners();

// Disable Hardware acceleration
// Normally, electron-settings needs to init and run in onReady
// But disableHardwareAcceleration needs to run before onReady
// So this is a hot fix workaround
try {
  const preferences = getPreferences();
  const { useHardwareAcceleration } = preferences;
  if (!useHardwareAcceleration) {
    app.disableHardwareAcceleration();
  }
} catch (err) {
  // eslint-disable-next-line
  console.log(err);
}

const createWindow = () => {
  const preferences = getPreferences();
  const {
    autoHideMenuBar,
    proxyRules,
    swipeToNavigate,
  } = preferences;

  // Keep window size and restore on startup
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 768,
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 480,
    minHeight: 320,
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default',
    autoHideMenuBar,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
    },
  });

  // link window with window size management lib
  mainWindowState.manage(mainWindow);

  // set proxy
  session.fromPartition('persist:app').setProxy({ proxyRules }, () => {
    // eslint-disable-next-line
    console.log('Proxies are set');
  });

  // and load the index.html of the app.
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.resolve(__dirname, '..', 'build', 'index.html')}`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Hide window instead closing on macos
  mainWindow.on('close', (e) => {
    if (process.platform === 'darwin' && !mainWindow.forceClose) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  createMenu();

  // Enable swipe to navigate
  if (swipeToNavigate) {
    mainWindow.on('swipe', (e, direction) => {
      if (direction === 'left') {
        e.sender.send('go-back');
      } else if (direction === 'right') {
        e.sender.send('go-forward');
      }
    });
  }
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
  }
});

app.on('before-quit', () => {
  // https://github.com/atom/electron/issues/444#issuecomment-76492576
  if (process.platform === 'darwin') {
    if (mainWindow) {
      mainWindow.forceClose = true;
    }
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
