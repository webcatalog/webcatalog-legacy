const {
  app,
  BrowserWindow,
  Menu,
} = require('electron');
const path = require('path');
const windowStateKeeper = require('electron-window-state');
const { autoUpdater } = require('electron-updater');
const { menubar } = require('menubar');

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

const createAsync = () => {
  attachToMenubar = getPreference('attachToMenubar');
  if (attachToMenubar) {
    const menubarWindowState = windowStateKeeper({
      file: 'window-state-menubar.json',
      defaultWidth: 415,
      defaultHeight: 500,
    });

    mb = menubar({
      index: REACT_PATH,
      icon: path.resolve(__dirname, '..', 'menubar-icon.png'),
      preloadWindow: true,
      browserWindow: {
        x: menubarWindowState.x,
        y: menubarWindowState.y,
        width: menubarWindowState.width,
        height: menubarWindowState.height,
        minWidth: 415,
        minHeight: 500,
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false,
          preload: path.join(__dirname, '..', 'preload', 'menubar.js'),
        },
      },
    });

    return new Promise((resolve, reject) => {
      try {
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
              click: () => {
                global.updateSilent = false;
                autoUpdater.checkForUpdates();
              },
              visible: updaterEnabled,
            };
            if (global.updateDownloaded) {
              updaterMenuItem.label = 'Restart to Apply Updates...';
              updaterMenuItem.click = () => {
                setImmediate(() => {
                  app.removeAllListeners('window-all-closed');
                  if (get() != null) {
                    get().close();
                  }
                  autoUpdater.quitAndInstall(false);
                });
              };
            } else if (global.updaterProgressObj) {
              const { transferred, total, bytesPerSecond } = global.updaterProgressObj;
              updaterMenuItem.label = `Downloading Updates (${formatBytes(transferred)}/${formatBytes(total)} at ${formatBytes(bytesPerSecond)}/s)...`;
              updaterMenuItem.enabled = false;
            }

            const contextMenu = Menu.buildFromTemplate([
              {
                label: 'About WebCatalog',
                click: () => {
                  sendToAllWindows('open-dialog-about');
                  mb.showWindow();
                },
              },
              {
                label: 'Check for Updates...',
                click: () => {
                  global.updateSilent = false;
                  autoUpdater.checkForUpdates();
                },
              },
              {
                label: registered ? 'Registered' : 'Registration...',
                enabled: !registered,
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
      } catch (e) {
        reject(e);
      }
    });
  }

  const mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 768,
  });

  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 415,
    minHeight: 500,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  mainWindowState.manage(win);

  win.loadURL(REACT_PATH);

  win.on('closed', () => {
    win = null;
  });

  return Promise.resolve();
};

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
