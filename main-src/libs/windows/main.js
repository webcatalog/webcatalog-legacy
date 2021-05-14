/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  BrowserWindow,
  Menu,
  Tray,
  app,
  ipcMain,
  nativeImage,
  shell,
} = require('electron');
const path = require('path');
const windowStateKeeper = require('electron-window-state');
const { menubar } = require('menubar');

const sendToAllWindows = require('../send-to-all-windows');
const { getPreference } = require('../preferences');
const { REACT_PATH } = require('../constants/paths');

const formatBytes = require('../format-bytes');

let win;
let tray;
let mb = {};
let attachToMenubar = false;

const get = () => {
  if (attachToMenubar) return mb.window;
  return win;
};

const createAsync = () => new Promise((resolve) => {
  const handleTrayRightClick = () => {
    const registered = getPreference('registered');
    const updaterEnabled = process.env.SNAP == null
      && !process.mas && !process.windowsStore;
    const updaterMenuItem = {
      label: 'Check for Updates',
      click: () => ipcMain.emit('request-check-for-updates'),
      visible: updaterEnabled,
    };
    if (global.updaterObj && global.updaterObj.status === 'update-downloaded') {
      updaterMenuItem.label = 'Restart to Apply Updates...';
    } else if (global.updaterObj && global.updaterObj.status === 'update-available') {
      updaterMenuItem.label = 'Downloading Updates...';
      updaterMenuItem.enabled = false;
    } else if (global.updaterObj && global.updaterObj.status === 'download-progress') {
      const { transferred, total, bytesPerSecond } = global.updaterObj.info;
      updaterMenuItem.label = `Downloading Updates (${formatBytes(transferred)}/${formatBytes(total)} at ${formatBytes(bytesPerSecond)}/s)...`;
      updaterMenuItem.enabled = false;
    } else if (global.updaterObj && global.updaterObj.status === 'checking-for-update') {
      updaterMenuItem.label = 'Checking for Updates...';
      updaterMenuItem.enabled = false;
    }

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open WebCatalog',
        click: () => get().show(),
      },
      {
        type: 'separator',
      },
      {
        label: 'About WebCatalog',
        click: () => {
          sendToAllWindows('open-dialog-about');
          get().show();
        },
      },
      {
        type: 'separator',
      },
      {
        label: registered ? 'WebCatalog Lifetime' : 'WebCatalog Basic',
        visible: true,
        enabled: false,
        click: null,
      },
      {
        label: 'Upgrade...',
        visible: !registered,
        click: registered ? null : () => {
          sendToAllWindows('open-license-registration-dialog');
          get().show();
        },
      },
      {
        type: 'separator',
        visible: updaterEnabled,
      },
      updaterMenuItem,
      { type: 'separator' },
      {
        label: 'Preferences...',
        click: () => {
          sendToAllWindows('go-to-preferences');
          get().show();
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          if (attachToMenubar) {
            mb.app.quit();
          } else {
            app.quit();
          }
        },
      },
    ]);
    (attachToMenubar ? mb.tray : tray).popUpContextMenu(contextMenu);
  };

  // only supported on macOS
  attachToMenubar = process.platform !== 'linux' && getPreference('attachToMenubar');

  if (attachToMenubar) {
    const menubarWindowState = windowStateKeeper({
      file: 'window-state-menubar.json',
      defaultWidth: 600,
      defaultHeight: 500,
    });

    // setImage after Tray instance is created to avoid
    // "Segmentation fault (core dumped)" bug on Linux
    // https://github.com/electron/electron/issues/22137#issuecomment-586105622
    // https://github.com/atomery/translatium/issues/164
    tray = new Tray(nativeImage.createEmpty());
    // icon template is not supported on Windows & Linux
    const iconFileName = process.platform === 'darwin' ? 'menubarTemplate.png' : 'menubar.png';
    let iconPath;
    if (process.env.NODE_ENV === 'production') {
      iconPath = path.resolve(__dirname, 'images', iconFileName);
    } else {
      iconPath = path.resolve(__dirname, '..', '..', 'images', iconFileName);
    }
    tray.setImage(iconPath);

    mb = menubar({
      index: REACT_PATH,
      tray,
      preloadWindow: true,
      tooltip: 'WebCatalog',
      browserWindow: {
        alwaysOnTop: getPreference('alwaysOnTop'),
        x: menubarWindowState.x,
        y: menubarWindowState.y,
        width: menubarWindowState.width,
        height: menubarWindowState.height,
        minWidth: 600,
        minHeight: 500,
        webPreferences: {
          enableRemoteModule: true,
          contextIsolation: false,
          nodeIntegration: true,
          webSecurity: process.env.NODE_ENV === 'production',
          preload: path.join(__dirname, 'preload-menubar.js'),
        },
      },
    });

    mb.on('after-create-window', () => {
      menubarWindowState.manage(mb.window);

      mb.window.on('focus', () => {
        const view = mb.window.getBrowserView();
        if (view && view.webContents) {
          view.webContents.focus();
        }
      });
    });

    mb.on('ready', () => {
      mb.tray.on('right-click', handleTrayRightClick);

      resolve();
    });
    return;
  }

  const mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 768,
  });

  let icon;
  if (process.platform === 'linux') {
    if (process.env.NODE_ENV === 'production') {
      icon = path.resolve(__dirname, 'images', 'icon.png');
    } else {
      icon = path.resolve(__dirname, '..', '..', 'images', 'icon.png');
    }
  }

  const winOpts = {
    backgroundColor: '#FFF',
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 600,
    minHeight: 500,
    titleBarStyle: 'hiddenInset',
    show: false,
    frame: process.platform === 'darwin' || global.useSystemTitleBar,
    alwaysOnTop: getPreference('alwaysOnTop'),
    webPreferences: {
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: process.env.NODE_ENV === 'production',
      preload: path.join(__dirname, 'preload-main.js'),
    },
  };
  // winOpts.icon cannot be set to undefined
  // as it'd crash Electron on macOS
  // https://github.com/electron/electron/issues/27303#issuecomment-759501184
  if (icon) {
    winOpts.icon = icon;
  }
  win = new BrowserWindow(winOpts);

  mainWindowState.manage(win);

  // check system-preferences.js
  // wasOpenedAsHidden is only available on macOS
  const { wasOpenedAsHidden } = app.getLoginItemSettings();
  win.once('ready-to-show', () => {
    if (!wasOpenedAsHidden) {
      win.show();
    }
  });

  win.webContents.on('new-window', (e, nextUrl) => {
    e.preventDefault();
    shell.openExternal(nextUrl);
  });

  win.on('closed', () => {
    win = null;
  });

  win.on('enter-full-screen', () => {
    win.webContents.send('set-is-full-screen', true);
  });
  win.on('leave-full-screen', () => {
    win.webContents.send('set-is-full-screen', false);
  });

  win.on('maximize', () => {
    win.webContents.send('set-is-maximized', true);
  });
  win.on('unmaximize', () => {
    win.webContents.send('set-is-maximized', false);
  });

  // ensure redux is loaded first
  // if not, redux might not be able catch changes sent from ipcMain
  win.webContents.once('did-stop-loading', () => {
    resolve();
  });

  win.loadURL(REACT_PATH);

  const shouldShowTray = getPreference('trayIcon');
  if (shouldShowTray && tray == null) {
    tray = new Tray(nativeImage.createEmpty());
    const iconFileName = process.platform === 'darwin' ? 'menubarTemplate.png' : 'menubar.png';
    let iconPath;
    if (process.env.NODE_ENV === 'production') {
      iconPath = path.resolve(__dirname, 'images', iconFileName);
    } else {
      iconPath = path.resolve(__dirname, '..', '..', 'images', iconFileName);
    }
    tray.setImage(iconPath);
    tray.on('click', () => {
      if (win == null) {
        createAsync();
      } else {
        win.show();
      }
    });
    tray.setToolTip(app.name);
    tray.on('right-click', handleTrayRightClick);
  }
});

const show = () => {
  if (attachToMenubar) {
    if (mb == null) {
      createAsync();
    } else {
      mb.on('ready', () => {
        mb.showWindow();
      });
    }
  } else if (win == null) {
    createAsync();
  } else {
    win.show();
  }
};

const send = (...args) => {
  if (get() !== null) {
    get().webContents.send(...args);
  }
};

module.exports = {
  createAsync,
  get,
  send,
  show,
};
