/* eslint-disable import/no-extraneous-dependencies */

const electron = require('electron');
const argv = require('optimist').argv;

const { app, BrowserWindow, dialog, ipcMain } = electron;

const path = require('path');
const url = require('url');

const createMenu = require('./createMenu');
const windowStateKeeper = require('./windowStateKeeper');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  const isWebView = argv.url && argv.id;

  const mainWindowState = windowStateKeeper({
    id: isWebView ? argv.id : 'webcatalog',
    defaultWidth: isWebView ? 1280 : 800,
    defaultHeight: isWebView ? 800 : 600,
  });

  // Create the browser window.
  const options = isWebView ? {
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    title: argv.name,
    webPreferences: {
      javascript: true,
      plugins: true,
      // node globals causes problems with sites like messenger.com
      nodeIntegration: false,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  } : {
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 500,
    minHeight: 400,
    titleBarStyle: 'hidden',
  };

  mainWindow = new BrowserWindow(options);

  mainWindowState.manage(mainWindow);

  const windowUrl = isWebView ? argv.url : url.format({
    pathname: path.join(__dirname, 'www', 'index.html'),
    protocol: 'file:',
    slashes: true,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(windowUrl);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  let currentZoom = 1;
  const ZOOM_INTERVAL = 0.1;

  const onZoomIn = () => {
    currentZoom += ZOOM_INTERVAL;
    mainWindow.webContents.send('change-zoom', currentZoom);
  };

  const onZoomOut = () => {
    currentZoom -= ZOOM_INTERVAL;
    mainWindow.webContents.send('change-zoom', currentZoom);
  };

  const onGoBack = () => {
    mainWindow.webContents.goBack();
  };

  const onGoForward = () => {
    mainWindow.webContents.goForward();
  };

  const clearAppData = () => {
    dialog.showMessageBox(mainWindow, {
      type: 'warning',
      buttons: ['Yes', 'Cancel'],
      defaultId: 1,
      title: 'Clear cache confirmation',
      message: 'This will clear all data (cookies, local storage etc) from every app installed from WebCatalog. Are you sure you wish to proceed?',
    }, (response) => {
      if (response === 0) {
        const session = mainWindow.webContents.session;
        session.clearStorageData(() => {
          session.clearCache();
        });
      }
    });
  };

  const getCurrentUrl = () => mainWindow.webContents.getURL();

  const menuOptions = {
    webView: argv.url,
    appName: argv.name || 'WebCatalog',
    appQuit: app.quit,
    zoomIn: onZoomIn,
    zoomOut: onZoomOut,
    goBack: onGoBack,
    goForward: onGoForward,
    getCurrentUrl,
  };

  createMenu(menuOptions);

  ipcMain.on('clearAppData', () => {
    clearAppData();
  });
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
