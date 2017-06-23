const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const url = require('url');
const path = require('path');

const argv = require('yargs-parser')(process.argv.slice(1));

const windowStateKeeper = require('./libs/windowStateKeeper');
const createMenu = require('./libs/createMenu');


// Development mode
const isDevelopment = argv.development === 'true';

// Spectron mode
const isTesting = argv.testing === 'true';

// Call the app binary with url & id argument to activate webshell mode.
const isShell = argv.url !== undefined && argv.id !== undefined;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// load ipcMain events
ipcMain.on('get-shell-info', (e) => {
  e.returnValue = {
    id: argv.id,
    name: argv.name,
    url: argv.url,
    userAgent: mainWindow && mainWindow.webContents.getUserAgent().replace(`Electron/${process.versions.electron}`, ''), // make browser think SSB is a browser
    isTesting,
    isDevelopment,
    preload: path.join(__dirname, 'webview_preload.js'),
  };
});


const createWindow = () => {
  // Keep window size and restore on startup
  const mainWindowState = windowStateKeeper({
    id: isShell ? argv.id : 'webcatalog', // Store window size of store and every web shell seperately
    defaultWidth: 1024,
    defaultHeight: 768,
  });

  let titleBarStyle = 'default';
  if (process.platform === 'darwin') {
    titleBarStyle = isShell ? 'hiddenInset' : 'hidden';
  }

  const options = {
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 500,
    minHeight: isShell ? 400 : 600,
    title: argv.name || 'WebCatalog',
    titleBarStyle,
    frame: true,
    icon: process.platform === 'linux' ? `~/.icons/webcatalog/${argv.id}.png` : null,
    webPreferences: {
      // enable nodeintegration in testing mode (mainly for Spectron)
      nodeIntegration: isTesting,
      webviewTag: true,
      preload: path.join(__dirname, 'main_preload.js'),
    },
  };

  // create window
  mainWindow = new BrowserWindow(options);

  // link window with window size management lib
  mainWindowState.manage(mainWindow);

  // load menu
  createMenu();

  if (isDevelopment) {
    // Download the file from webpack dev server to reproduce production more accurately.
    const devHTMLUrl = `http://localhost:3000/${isShell ? 'shell.html' : 'store.html'}`;

    if (isShell) {
      mainWindow.loadURL(devHTMLUrl);
    } else {
      // eslint-disable-next-line
      const request = require('request');

      const HTMLPath = path.join(app.getPath('appData'), 'tmp.html');

      const HTMLUrl = url.format({
        pathname: HTMLPath,
        protocol: 'file:',
        slashes: true,
      });

      request(devHTMLUrl)
        .pipe(fs.createWriteStream(HTMLPath))
        .on('finish', () => {
          mainWindow.loadURL(HTMLUrl);
        });
    }
  } else {
    // load window
    const HTMLUrl = url.format({
      pathname: path.join(__dirname, 'www', isShell ? 'shell.html' : 'store.html'),
      protocol: 'file:',
      slashes: true,
    });
    mainWindow.loadURL(HTMLUrl);
  }
};

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow) {
    mainWindow.show();
  } else {
    createWindow();
  }
});
