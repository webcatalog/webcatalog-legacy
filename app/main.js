/* eslint-disable import/no-extraneous-dependencies */

const electron = require('electron');
const argv = require('optimist').argv;
const autoUpdater = require('electron-auto-updater').autoUpdater;

const { app, BrowserWindow, dialog, ipcMain, shell } = electron;

const path = require('path');
const url = require('url');

const createMenu = require('./createMenu');
const windowStateKeeper = require('./windowStateKeeper');

const FLASH_VERSION = '24.0.0.186';
const WIDEVINECDM_VERSION = '1.4.8.903';

// load plugins
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, 'plugins/PepperFlash', FLASH_VERSION, 'PepperFlashPlayer.plugin').replace('app.asar', 'app.asar.unpacked'));
app.commandLine.appendSwitch('ppapi-flash-version', FLASH_VERSION);

app.commandLine.appendSwitch('widevine-cdm-path', path.join(__dirname, 'plugins/WidevineCdm', WIDEVINECDM_VERSION, 'widevinecdmadapter.plugin').replace('app.asar', 'app.asar.unpacked'));
app.commandLine.appendSwitch('widevine-cdm-version', WIDEVINECDM_VERSION);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const extractDomain = (fullUrl) => {
  const matches = fullUrl.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  const domain = matches && matches[1];
  return domain ? domain.replace('www.', '') : null;
};

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

  const log = (message) => {
    mainWindow.webContents.send('log', message);
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

  if (isWebView) {
    const webViewDomain = extractDomain(argv.url);

    const handleRedirect = (e, nextUrl) => {
      // open external url in browser if domain doesn't match.
      const nextDomain = extractDomain(nextUrl);
      if (nextDomain && nextDomain !== webViewDomain) {
        e.preventDefault();
        shell.openExternal(nextUrl);
      }
    };

    mainWindow.webContents.on('will-navigate', handleRedirect);
    mainWindow.webContents.on('new-window', handleRedirect);
  } else {
    // only check update in WebCatalog main app.
    mainWindow.webContents.once('did-finish-load', () => {
      setTimeout(() => {
        // Auto updater
        const feedUrl = `https://backend.getwebcatalog.com/update/${process.platformos}/${app.getVersion()}.json`;

        autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName) => {
          dialog.showMessageBox({
            type: 'info',
            buttons: ['Yes', 'Cancel'],
            defaultId: 1,
            title: 'A new update is ready to install',
            message: `Version ${releaseName} is downloaded and will be automatically installed. Do you want to quit the app to install it now?`,
          }, (response) => {
            if (response === 0) {
              autoUpdater.quitAndInstall();
            }
          });
        });

        autoUpdater.addListener('error', err => log(`Update error: ${err.message}`));
        autoUpdater.on('checking-for-update', () => log('Checking for update'));
        autoUpdater.on('update-available', () => log('Update available'));
        autoUpdater.on('update-not-available', () => log('No update available'));

        if (process.platform === 'darwin') {
          autoUpdater.setFeedURL(feedUrl);
        }

        autoUpdater.checkForUpdates();
      }, 1000);
    });
  }
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
