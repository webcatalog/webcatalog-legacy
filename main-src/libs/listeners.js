/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  app,
  dialog,
  ipcMain,
  nativeTheme,
  shell,
} = require('electron');
const { autoUpdater } = require('electron-updater');

const { captureException } = require('@sentry/electron');

const sendToAllWindows = require('./send-to-all-windows');
const getWebsiteIconUrlAsync = require('./get-website-icon-url-async');

const openApp = require('./app-management/open-app');
const installAppAsync = require('./app-management/install-app-async');
const uninstallAppAsync = require('./app-management/uninstall-app-async');
const getInstalledAppsAsync = require('./app-management/get-installed-apps-async');

const {
  getPreference,
  getPreferences,
  setPreference,
  resetPreferences,
} = require('./preferences');

const {
  getSystemPreference,
  getSystemPreferences,
  setSystemPreference,
} = require('./system-preferences');

const { createMenu, showMenu } = require('./menu');

const mainWindow = require('./windows/main');

const send = (webContents, ...args) => {
  // check to make sure webContents is not destroyed
  if (webContents && !webContents.isDestroyed()) {
    webContents.send(...args);
  }
};

const loadListeners = () => {
  ipcMain.on('request-open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });

  ipcMain.on('request-show-message-box', (e, message, type) => {
    dialog.showMessageBox(mainWindow.get(), {
      type: type || 'error',
      message,
      buttons: ['OK'],
      cancelId: 0,
      defaultId: 0,
    }).catch(console.log); // eslint-disable-line
  });

  // Preferences
  ipcMain.on('get-preference', (e, name) => {
    const val = getPreference(name);
    e.returnValue = val;
  });

  ipcMain.on('get-preferences', (e) => {
    const preferences = getPreferences();
    e.returnValue = preferences;
  });

  ipcMain.on('request-set-preference', (e, name, value) => {
    setPreference(name, value);
  });

  // System Preferences
  ipcMain.on('get-system-preference', (e, name) => {
    const val = getSystemPreference(name);
    e.returnValue = val;
  });

  ipcMain.on('get-system-preferences', (e) => {
    const preferences = getSystemPreferences();
    e.returnValue = preferences;
  });

  ipcMain.on('request-set-system-preference', (e, name, value) => {
    setSystemPreference(name, value);
  });

  ipcMain.on('request-reset-preferences', () => {
    resetPreferences();
    createMenu();
  });

  ipcMain.on('request-restart', () => {
    app.relaunch();
    app.exit(0);
  });

  ipcMain.on('request-open-install-location', () => {
    const installationPath = getPreference('installationPath').replace('~', app.getPath('home'));
    shell.openPath(installationPath);
  });

  // App Management
  let scanningPromise = Promise.resolve();
  ipcMain.on('request-get-installed-apps', () => {
    scanningPromise = scanningPromise
      .then(() => getInstalledAppsAsync())
      .catch((error) => {
        dialog.showMessageBox(mainWindow.get(), {
          type: 'error',
          message: `Failed to scan for installed apps. (${error.stack})`,
          buttons: ['OK'],
          cancelId: 0,
          defaultId: 0,
        }).catch(console.log); // eslint-disable-line
      });
  });

  ipcMain.on('request-open-app', (e, id, name) => openApp(id, name));

  ipcMain.on('request-uninstall-app', (e, id, name, engine) => {
    dialog.showMessageBox(mainWindow.get(), {
      type: 'question',
      buttons: ['Uninstall', 'Cancel'],
      message: `Are you sure you want to uninstall ${name}? This action cannot be undone.`,
      cancelId: 1,
    }).then(({ response }) => {
      if (response === 0) {
        send(e.sender, 'set-app', id, {
          status: 'UNINSTALLING',
        });

        uninstallAppAsync(id, name, engine)
          .then(() => {
            send(e.sender, 'remove-app', id);
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
            if (error && error.message && (error.message.startsWith('EBUSY') || error.message === 'Application is in use.')) {
              send(e.sender, 'enqueue-snackbar', `Failed to uninstall ${name} as the application is in use.`, 'error');
            } else {
              captureException(error);
              send(e.sender, 'enqueue-snackbar', `Failed to uninstall ${name}.`, 'error');
            }
            send(e.sender, 'set-app', id, {
              status: 'INSTALLED',
            });
          });
      }
    })
    .catch(console.log); // eslint-disable-line
  });

  // Chain app installing promises
  let p = Promise.resolve();

  const promiseFuncMap = {};

  ipcMain.on('request-install-app', (e, engine, id, name, url, icon, opts) => {
    Promise.resolve()
      .then(() => {
        send(e.sender, 'set-app', id, {
          status: 'INSTALLING',
          lastUpdated: new Date().getTime(),
          engine,
          id,
          name,
          url,
          icon,
          opts,
          cancelable: true,
        });

        promiseFuncMap[id] = () => {
          // prevent canceling when installation has already started
          send(e.sender, 'set-app', id, {
            cancelable: false,
          });

          return installAppAsync(engine, id, name, url, icon, opts)
            .then((newApp) => {
              send(e.sender, 'set-app', id, {
                ...newApp,
                status: 'INSTALLED',
              });
              delete promiseFuncMap[id];
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.log(error);
              if (error && error.message && error.message.includes('is not installed')) {
                send(e.sender, 'enqueue-snackbar', error.message, 'error');
              } else if (error && error.message && error.message.startsWith('WebCatalog is outdated')) {
                send(e.sender, 'enqueue-snackbar', error.message, 'error');
              } else {
                captureException(error);
                send(e.sender, 'enqueue-snackbar', `Failed to install ${name}.`, 'error');
              }
              send(e.sender, 'remove-app', id);
              delete promiseFuncMap[id];
            });
        };

        p = p.then(() => {
          if (promiseFuncMap[id]) {
            return promiseFuncMap[id]();
          }
          return null;
        });
      });
  });

  ipcMain.on('request-update-app', (e, engine, id, name, url, icon, opts) => {
    Promise.resolve()
      .then(() => {
        send(e.sender, 'set-app', id, {
          status: 'INSTALLING',
          cancelable: true,
        });

        promiseFuncMap[id] = () => {
          // prevent canceling when installation has already started
          send(e.sender, 'set-app', id, {
            cancelable: false,
          });

          return installAppAsync(engine, id, name, url, icon, opts)
            .then((newApp) => {
              let displayedIcon;
              // display latest icon from WebCatalog
              if (!id.startsWith('custom-')) {
                if (process.platform === 'win32') {
                  displayedIcon = `https://storage.webcatalog.app/catalog/${id}/${id}-icon-unplated-128.webp`;
                } else {
                  displayedIcon = `https://storage.webcatalog.app/catalog/${id}/${id}-icon-128.webp`;
                }
              }

              send(e.sender, 'set-app', id, {
                ...newApp,
                status: 'INSTALLED',
                lastUpdated: new Date().getTime(),
                // ensure fresh icon from the catalog is shown
                icon128: displayedIcon,
              });
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.log(error);
              if (error && error.message && error.message.includes('is not installed')) {
                send(e.sender, 'enqueue-snackbar', error.message, 'error');
              } else if (error && error.message && (error.message.startsWith('EBUSY') || error.message === 'Application is in use.')) {
                send(e.sender, 'enqueue-snackbar', `Failed to update ${name} as the application is in use.`, 'error');
              } else if (error && error.message && error.message.startsWith('WebCatalog is outdated')) {
                send(e.sender, 'enqueue-snackbar', error.message, 'error');
              } else {
                send(e.sender, 'enqueue-snackbar', `Failed to update ${name}.`, 'error');
                captureException(error);
              }
              send(e.sender, 'set-app', id, {
                status: 'INSTALLED',
              });
            });
        };

        p = p.then(() => {
          if (promiseFuncMap[id]) {
            return promiseFuncMap[id]();
          }
          return null;
        });
      });
  });

  ipcMain.on('request-cancel-install-app', (e, id) => {
    if (promiseFuncMap[id]) {
      send(e.sender, 'remove-app', id);
      delete promiseFuncMap[id];
    }
  });

  ipcMain.on('request-cancel-update-app', (e, id) => {
    if (promiseFuncMap[id]) {
      send(e.sender, 'set-app', id, {
        status: 'INSTALLED',
        cancelable: false,
      });
      delete promiseFuncMap[id];
    }
  });

  ipcMain.on('request-quit', () => {
    app.quit();
  });

  ipcMain.on('request-check-for-updates', (e, isSilent) => {
    // https://github.com/electron-userland/electron-builder/issues/4028
    if (!autoUpdater.isUpdaterActive()) return;

    // restart & apply updates
    if (global.updaterObj && global.updaterObj.status === 'update-downloaded') {
      setImmediate(() => {
        app.removeAllListeners('window-all-closed');
        if (mainWindow.get() != null) {
          mainWindow.get().close();
        }
        autoUpdater.quitAndInstall(false);
      });
    }

    // check for updates
    global.updateSilent = Boolean(isSilent);
    autoUpdater.checkForUpdates();
  });

  // to be replaced with invoke (electron 7+)
  // https://electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
  ipcMain.on('request-get-website-icon-url', (e, id, url) => {
    getWebsiteIconUrlAsync(url)
      .then((iconUrl) => {
        sendToAllWindows(id, iconUrl);
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line no-console
        sendToAllWindows(id, null);
      });
  });

  // Native Theme
  ipcMain.on('get-should-use-dark-colors', (e) => {
    e.returnValue = nativeTheme.shouldUseDarkColors;
  });

  // Register an event listener.
  // When ipcRenderer sends mouse click co-ordinates, show menu at that position.
  // https://dev.to/saisandeepvaddi/creating-a-custom-menu-bar-in-electron-1pi3
  ipcMain.on('request-show-app-menu', (e, x, y) => {
    const win = mainWindow.get();
    if (win) {
      showMenu(win, x, y);
    }
  });
};

module.exports.load = loadListeners;
