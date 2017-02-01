/* eslint-disable import/no-extraneous-dependencies */

const electron = require('electron');

const argv = require('optimist').argv;
const path = require('path');
const url = require('url');
const settings = require('electron-settings');

const { app, BrowserWindow } = electron;

const createMenu = require('./libs/createMenu');
const windowStateKeeper = require('./libs/windowStateKeeper');
const checkForUpdate = require('./libs/checkForUpdate');
const loadPlugins = require('./libs/loadPlugins');

loadPlugins();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // set default settings
  settings.defaults({
    behaviors: {
      swipeToNavigate: true,
      rememberLastPages: true,
    },
  });
  settings.applyDefaultsSync();

  const isWebView = argv.url && argv.id;

  const mainWindowState = windowStateKeeper({
    id: isWebView ? argv.id : 'webcatalog',
    defaultWidth: isWebView ? 1280 : 800,
    defaultHeight: isWebView ? 800 : 600,
  });

  const options = {
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 500,
    minHeight: 400,
    title: argv.name || 'WebCatalog',
    titleBarStyle: 'hidden',
  };

  mainWindow = new BrowserWindow(options);

  mainWindowState.manage(mainWindow);

  const windowUrl = url.format({
    pathname: path.join(__dirname, 'www', 'app.html'),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(windowUrl);

  const log = (message) => {
    mainWindow.webContents.send('log', message);
  };

  createMenu({
    isWebView,
    appName: argv.name,
    appId: argv.id,
    mainWindow,
    log,
  });

  checkForUpdate(mainWindow, log);
}

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

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
