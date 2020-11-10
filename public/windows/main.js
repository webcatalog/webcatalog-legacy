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
} = require('electron');
const path = require('path');
const windowStateKeeper = require('electron-window-state');
const { menubar } = require('menubar');
const isDev = require('electron-is-dev');

const sendToAllWindows = require('../libs/send-to-all-windows');
const { getPreference } = require('../libs/preferences');
const { REACT_PATH } = require('../constants/paths');

const formatBytes = require('../libs/format-bytes');

let win;
let mb = {};
let attachToMenubar = false;

const get = () => {
  if (attachToMenubar) return mb.window;
  return win;
};

const createAsync = () => new Promise((resolve) => {
  attachToMenubar = getPreference('attachToMenubar');

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
    const tray = new Tray(nativeImage.createEmpty());
    // icon template is not supported on Windows & Linux
    const iconPath = path.resolve(__dirname, '..', process.platform === 'darwin' ? 'menubarTemplate.png' : 'menubar.png');
    tray.setImage(iconPath);

    mb = menubar({
      index: REACT_PATH,
      tray,
      preloadWindow: true,
      tooltip: 'WebCatalog',
      browserWindow: {
        x: menubarWindowState.x,
        y: menubarWindowState.y,
        width: menubarWindowState.width,
        height: menubarWindowState.height,
        minWidth: 600,
        minHeight: 500,
        webPreferences: {
          enableRemoteModule: true,
          nodeIntegration: true,
          webSecurity: !isDev,
          preload: path.join(__dirname, '..', 'preload', 'menubar.js'),
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
      mb.tray.on('right-click', () => {
        const registered = getPreference('registered');
        const updaterEnabled = process.env.SNAP == null
          && !process.mas && !process.windowsStore;
        const updaterMenuItem = {
          label: 'Check for Updates...',
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
            click: () => mb.showWindow(),
          },
          {
            type: 'separator',
          },
          {
            label: 'About WebCatalog',
            click: () => {
              sendToAllWindows('open-dialog-about');
              mb.showWindow();
            },
          },
          {
            type: 'separator',
          },
          {
            label: registered ? 'WebCatalog Plus' : 'WebCatalog Basic',
            visible: true,
            enabled: false,
            click: null,
          },
          {
            label: 'Upgrade...',
            visible: !registered,
            click: registered ? null : () => {
              sendToAllWindows('open-license-registration-dialog');
              mb.showWindow();
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
              mb.showWindow();
            },
          },
          { type: 'separator' },
          {
            label: 'Quit',
            click: () => {
              mb.app.quit();
            },
          },
        ]);
        mb.tray.popUpContextMenu(contextMenu);
      });

      resolve();
    });
    return;
  }

  const mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 768,
  });

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 600,
    minHeight: 500,
    titleBarStyle: 'hiddenInset',
    icon: process.platform === 'linux' ? path.resolve(__dirname, '..', 'icon.png') : undefined,
    show: false,
    frame: process.platform === 'darwin',
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      webSecurity: !isDev,
      preload: path.join(__dirname, '..', 'preload', 'main.js'),
    },
  });

  mainWindowState.manage(win);

  const { wasOpenedAsHidden } = app.getLoginItemSettings();
  win.once('ready-to-show', () => {
    if (!wasOpenedAsHidden) {
      win.show();
    }
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
