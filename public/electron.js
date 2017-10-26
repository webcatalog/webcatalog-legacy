const { app, BrowserWindow, dialog } = require('electron');
const argv = require('yargs-parser')(process.argv.slice(1));
const isDev = require('electron-is-dev');
const path = require('path');
const windowStateKeeper = require('electron-window-state');

const isLegacy = argv.url !== undefined && argv.id !== undefined;
const isTesting = argv.testing === 'true'; // Spectron mode

const createMenu = require('./libs/create-menu');
const loadListeners = require('./listeners');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isSecondInstance = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (isSecondInstance) {
  app.quit();
}

// load ipcMain listeners
loadListeners();

const createWindow = () => {
  // Keep window size and restore on startup
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 768,
  });

  const options = {
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 480,
    minHeight: 640,
    title: 'WebCatalog',
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: isTesting, // only needed for testing
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  };

  // create window
  mainWindow = new BrowserWindow(options);

  // link window with window size management lib
  mainWindowState.manage(mainWindow);

  // load menu
  createMenu();

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.resolve(__dirname, 'index.html')}`);

  // Emitted when the close button is clicked.
  mainWindow.on('close', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

app.on('ready', () => {
  if (isLegacy) {
    dialog.showMessageBox({
      type: 'error',
      title: 'The App Needs to Be Updated',
      message: 'You need to update this app to work with WebCatalog 7.0 and above. Launch WebCatalog to proceed.',
    }, () => {
      app.quit();
    });

    return;
  }

  createWindow();
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
  if (mainWindow) {
    mainWindow.show();
  } else {
    createWindow();
  }
});
