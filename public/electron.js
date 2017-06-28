const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const url = require('url');
const path = require('path');
const windowStateKeeper = require('electron-window-state');
const argv = require('yargs-parser')(process.argv.slice(1));

const createMenu = require('./libs/createMenu');
const loadListeners = require('./libs/loadListeners');

// Development mode
const isDevelopment = argv.development === 'true';

// Spectron mode
const isTesting = argv.testing === 'true';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// load ipcMain listeners
loadListeners();

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
    id: 'webcatalog', // Store window size of store and every web shell seperately
    defaultWidth: 1024,
    defaultHeight: 768,
  });

  let titleBarStyle = 'default';
  if (process.platform === 'darwin') {
    titleBarStyle = 'hidden';
  }

  const options = {
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 320,
    minHeight: 568,
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
    const devHTMLUrl = 'http://localhost:3000/store.html';

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
  } else {
    // load window
    const HTMLUrl = url.format({
      pathname: path.join(__dirname, '..', 'build', 'index.html'),
      protocol: 'file:',
      slashes: true,
    });
    mainWindow.loadURL(HTMLUrl);
  }

  // Emitted when the close button is clicked.
  mainWindow.on('close', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

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
  if (mainWindow) {
    mainWindow.show();
  } else {
    createWindow();
  }
});
