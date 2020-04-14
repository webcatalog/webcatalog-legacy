const {
  app,
  dialog,
  ipcMain,
  nativeTheme,
  shell,
} = require('electron');
const { autoUpdater } = require('electron-updater');
const commandExistsSync = require('command-exists').sync;

const sendToAllWindows = require('../libs/send-to-all-windows');
const getWebsiteIconUrlAsync = require('../libs/get-website-icon-url-async');

const openApp = require('../libs/app-management/open-app');
const installAppAsync = require('../libs/app-management/install-app-async');
const uninstallAppAsync = require('../libs/app-management/uninstall-app-async');
const getInstalledAppsAsync = require('../libs/app-management/get-installed-apps-async');

const {
  getPreference,
  getPreferences,
  setPreference,
  resetPreferences,
} = require('../libs/preferences');

const {
  getSystemPreference,
  getSystemPreferences,
  setSystemPreference,
} = require('../libs/system-preferences');

const createMenu = require('../libs/create-menu');

const mainWindow = require('../windows/main');

const packageJson = require('../../package.json');

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

    if (name === 'registered') {
      createMenu();
    }
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
    dialog.showMessageBox(mainWindow.get(), {
      type: 'question',
      buttons: ['Reset Now', 'Cancel'],
      message: 'Are you sure? All preferences will be restored to their original defaults. Browsing data won\'t be affected. This action cannot be undone.',
      cancelId: 1,
    }).then(({ response }) => {
      if (response === 0) {
        resetPreferences();
        createMenu();

        ipcMain.emit('request-show-require-restart-dialog');
      }
    }).catch(console.log); // eslint-disable-line
  });

  ipcMain.on('request-show-require-restart-dialog', () => {
    dialog.showMessageBox(mainWindow.get(), {
      type: 'question',
      buttons: ['Restart Now', 'Later'],
      message: 'You need to restart the app for this change to take affect.',
      cancelId: 1,
    }).then(({ response }) => {
      if (response === 0) {
        app.relaunch();
        app.exit(0);
      }
    }).catch(console.log); // eslint-disable-line
  });

  ipcMain.on('request-open-install-location', () => {
    const installationPath = getPreference('installationPath').replace('~', app.getPath('home'));
    shell.openItem(installationPath);
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
        e.sender.send('set-app', id, {
          status: 'UNINSTALLING',
        });

        uninstallAppAsync(id, name, engine)
          .then(() => {
            e.sender.send('remove-app', id);
          })
          .catch((error) => {
            /* eslint-disable-next-line */
            console.log(error);
            dialog.showMessageBox(mainWindow.get(), {
              type: 'error',
              message: `Failed to uninstall ${name}. (${error.stack})`,
              buttons: ['OK'],
              cancelId: 0,
              defaultId: 0,
            });
            e.sender.send('set-app', id, {
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

  const isUnzipInstalled = () => {
    // https://github.com/atomery/webcatalog/issues/614
    // unzip is used by electron-packager > cross-zip
    if (process.platform === 'linux' && !commandExistsSync('unzip')) {
      dialog.showMessageBox(mainWindow.get(), {
        type: 'error',
        message: 'unzip package is not installed on your system. Please install the package to continue.',
        buttons: ['OK', 'Learn more'],
        cancelId: 0,
        defaultId: 0,
      })
        .then(({ response }) => {
          if (response === 1) {
            shell.openExternal('https://pkgs.org/download/unzip');
          }
        })
        .catch(console.log); // eslint-disable-line
      return false;
    }
    return true;
  };

  ipcMain.on('request-install-app', (e, engine, id, name, url, icon) => {
    if (!isUnzipInstalled()) return;

    e.sender.send('set-app', id, {
      status: 'INSTALLING',
      engine,
      id,
      name,
      url,
      icon,
      cancelable: true,
    });

    promiseFuncMap[id] = () => {
      // prevent canceling when installation has already started
      e.sender.send('set-app', id, {
        cancelable: false,
      });

      return installAppAsync(engine, id, name, url, icon)
        .then(() => {
          e.sender.send('set-app', id, {
            engine,
            id,
            name,
            url,
            icon,
            version: packageJson.templateVersion,
            status: 'INSTALLED',
            registered: getPreference('registered'),
          });
          delete promiseFuncMap[id];
        })
        .catch((error) => {
          /* eslint-disable-next-line */
          console.log(error);
          dialog.showMessageBox(mainWindow.get(), {
            type: 'error',
            message: `Failed to install ${name}. (${error.message.includes('is not installed') ? error.message : error.stack})`,
            buttons: ['OK'],
            cancelId: 0,
            defaultId: 0,
          });
          e.sender.send('remove-app', id);
          delete promiseFuncMap[id];
        }).catch(console.log); // eslint-disable-line
    };

    p = p.then(() => {
      if (promiseFuncMap[id]) {
        return promiseFuncMap[id]();
      }
      return null;
    });
  });

  ipcMain.on('request-update-app', (e, engine, id, name, url, icon) => {
    if (!isUnzipInstalled()) return;

    e.sender.send('set-app', id, {
      status: 'INSTALLING',
      cancelable: true,
    });

    promiseFuncMap[id] = () => {
      // prevent canceling when installation has already started
      e.sender.send('set-app', id, {
        cancelable: false,
      });

      return installAppAsync(engine, id, name, url, icon)
        .then(() => {
          e.sender.send('set-app', id, {
            version: packageJson.templateVersion,
            status: 'INSTALLED',
            registered: getPreference('registered'),
            // ensure fresh icon from the catalog is shown
            icon: !id.startsWith('custom-') ? `https://s3.getwebcatalog.com/apps/${id}/${id}-icon.png` : icon,
          });
        })
        .catch((error) => {
          /* eslint-disable-next-line */
          console.log(error);
          dialog.showMessageBox(mainWindow.get(), {
            type: 'error',
            message: `Failed to update ${name}. (${error.message})`,
            buttons: ['OK'],
            cancelId: 0,
            defaultId: 0,
          }).catch(console.log); // eslint-disable-line
          e.sender.send('set-app', id, {
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

  ipcMain.on('request-cancel-install-app', (e, id) => {
    if (promiseFuncMap[id]) {
      e.sender.send('remove-app', id);
      delete promiseFuncMap[id];
    }
  });

  ipcMain.on('request-cancel-update-app', (e, id) => {
    if (promiseFuncMap[id]) {
      e.sender.send('set-app', id, {
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

    // https://github.com/atomery/webcatalog/issues/634
    // HACK(mc, 2019-09-10): work around https://github.com/electron-userland/electron-builder/issues/4046
    if (process.platform === 'linux' && process.env.DESKTOPINTEGRATION === 'AppImageLauncher') {
      // remap temporary running AppImage to actual source
      // THIS IS PROBABLY SUPER BRITTLE AND MAKES ME WANT TO STOP USING APPIMAGE
      autoUpdater.logger.info('AppImageLauncher detected.');
      autoUpdater.logger.info('rewriting $APPIMAGE', {
        oldValue: process.env.APPIMAGE,
        newValue: process.env.ARGV0,
      });
      process.env.APPIMAGE = process.env.ARGV0;
    }

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
};

module.exports = loadListeners;
