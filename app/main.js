/* eslint-disable import/no-extraneous-dependencies */

const electron = require('electron');

const argv = require('optimist').argv;
const path = require('path');
const url = require('url');
const settings = require('electron-settings');

const { app, BrowserWindow, ipcMain, shell } = electron;

const createMenu = require('./libs/createMenu');
const windowStateKeeper = require('./libs/windowStateKeeper');
const checkForUpdate = require('./libs/checkForUpdate');
const extractDomain = require('./libs/extractDomain');
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
    },
  });
  settings.applyDefaultsSync();

  settings.get('behaviors').then(({ swipeToNavigate, rememberLastPage }) => {
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
        partition: `persist:${argv.id}`,
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

    const log = (message) => {
      mainWindow.webContents.send('log', message);
    };

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });

    // do nothing for setDockBadge if not OSX
    let setDockBadge = () => {};

    if (process.platform === 'darwin') {
      setDockBadge = app.dock.setBadge;
    }

    /* Badge count */
    mainWindow.on('page-title-updated', (e, title) => {
      const itemCountRegex = /[([{](\d*?)[}\])]/;
      const match = itemCountRegex.exec(title);
      if (match) {
        setDockBadge(match[1]);
      } else {
        setDockBadge('');
      }
    });

    ipcMain.on('notification', () => {
      if (process.platform !== 'darwin' || mainWindow.isFocused()) {
        return;
      }
      setDockBadge('•');
    });

    mainWindow.on('focus', () => {
      setDockBadge('');
    });

    createMenu({
      isWebView,
      appName: argv.name || 'WebCatalog',
      appId: argv.id || 'webcatalog',
      mainWindow,
      log,
    });

    if (isWebView) {
      const webViewDomain = extractDomain(argv.url);

      const handleRedirect = (e, nextUrl) => {
        log(`newWindow: ${nextUrl}`);
        // open external url in browser if domain doesn't match.
        const nextDomain = extractDomain(nextUrl);

        // open new window
        if (nextDomain === null) {
          return;
        }

        // navigate
        if (nextDomain && (nextDomain === webViewDomain || nextDomain === 'accounts.google.com')) {
          // https://github.com/webcatalog/desktop/issues/35
          e.preventDefault();
          mainWindow.loadURL(nextUrl);
          return;
        }

        // open in browser
        e.preventDefault();
        shell.openExternal(nextUrl);
      };

      // mainWindow.webContents.on('will-navigate', handleRedirect);
      mainWindow.webContents.on('new-window', handleRedirect);

      // remove Electron from useragent
      // https://github.com/webcatalog/desktop/issues/28
      const userAgent = mainWindow.webContents.getUserAgent().replace(`Electron/${process.versions.electron}`, '');
      mainWindow.webContents.setUserAgent(userAgent);

      if (swipeToNavigate) {
        mainWindow.on('swipe', (e, direction) => {
          if (direction === 'left' && mainWindow.webContents.canGoBack()) {
            mainWindow.webContents.goBack();
          } else if (direction === 'right' && mainWindow.webContents.canGoForward()) {
            mainWindow.webContents.goForward();
          }
        });
      }

      if (rememberLastPage) {
        const handleNavigate = (e, curUrl) => {
          settings.set(`lastpages.${argv.id}`, curUrl);
        };

        mainWindow.webContents.on('did-navigate', handleNavigate);
        mainWindow.webContents.on('did-navigate-in-page', handleNavigate);
      }

      settings.get(`lastpages.${argv.id}`)
        .then((lastPage) => {
          if (lastPage) mainWindow.loadURL(lastPage);
          else mainWindow.loadURL(argv.url);
        })
        .catch(() => {
          mainWindow.loadURL(argv.url);
        });
    } else {
      const windowUrl = isWebView ? argv.url : url.format({
        pathname: path.join(__dirname, 'www', 'store.html'),
        protocol: 'file:',
        slashes: true,
      });

      // and load the index.html of the app.
      mainWindow.loadURL(windowUrl);
    }

    checkForUpdate(mainWindow, log);
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
