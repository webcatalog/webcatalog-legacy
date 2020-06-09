const {
  app,
  dialog,
  ipcMain,
  nativeTheme,
  shell,
} = require('electron');
const { autoUpdater } = require('electron-updater');
const commandExistsSync = require('command-exists').sync;
const os = require('os');

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

const getNetFrameworkVersionAsync = require('../libs/get-net-framework-version-async');
const getPowershellMajorVersionAsync = require('../libs/get-powershell-major-version-async');

const mainWindow = require('../windows/main');

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

  ipcMain.on('request-uninstall-apps', (e, apps) => {
    dialog.showMessageBox(mainWindow.get(), {
      type: 'question',
      buttons: ['Uninstall', 'Cancel'],
      message: `Are you sure you want to uninstall these ${apps.length} apps? This action cannot be undone.`,
      cancelId: 1,
    }).then(({ response }) => {
      if (response === 0) {
        e.sender.send('set-app-batch', apps.map((a) => ({
          id: a.id,
          status: 'UNINSTALLING',
        })));

        apps.forEach(({ id, name, engine }) => {
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
        });
      }
    })
    .catch(console.log); // eslint-disable-line
  });

  // Chain app installing promises
  let p = Promise.resolve();

  const promiseFuncMap = {};

  const checkCrossZipReadyAsync = async () => {
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

    // if the system is running Windows 7
    // check if user has installed .NET Framework 4.5 & Powershell 3
    // these packages are preinstalled on Windows 8+
    // cross-zip requires these packages
    // https://github.com/electron/electron-packager/issues/1018
    // https://github.com/atomery/webcatalog/wiki/System-Requirements-on-Windows
    // https://docs.microsoft.com/en-us/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed
    if (process.platform === 'win32' && os.release().startsWith('6.1')) {
      const powershellMajorVersion = await getPowershellMajorVersionAsync();
      const netFrameworkVersion = await getNetFrameworkVersionAsync();
      if (powershellMajorVersion < 3 || netFrameworkVersion < 378389) {
        const missingPackageNames = [];
        if (netFrameworkVersion < 378389) {
          missingPackageNames.push('.NET Framework 4.5 (or above)');
        }
        if (powershellMajorVersion < 3) {
          missingPackageNames.push('Powershell 3 (or above)');
        }

        dialog.showMessageBox(mainWindow.get(), {
          type: 'error',
          message: `${missingPackageNames.join(' and ')} ${missingPackageNames.length > 1 ? 'are' : 'is'} not installed on your system. Please install the packages to continue.`,
          buttons: ['OK', 'Learn more'],
          cancelId: 0,
          defaultId: 0,
        })
          .then(({ response }) => {
            if (response === 1) {
              shell.openExternal('https://github.com/atomery/webcatalog/wiki/System-Requirements-on-Windows');
            }
          })
          .catch(console.log); // eslint-disable-line
        return false;
      }
    }
    return true;
  };

  ipcMain.on('request-install-app', (e, engine, id, name, url, icon) => {
    Promise.resolve()
      .then(() => { // check if WebCatalog is ready to install app
        if (engine === 'electron') return checkCrossZipReadyAsync();
        return true;
      })
      .then((isReady) => {
        if (!isReady) return;

        e.sender.send('set-app', id, {
          status: 'INSTALLING',
          lastUpdated: new Date().getTime(),
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
            .then((version) => {
              e.sender.send('set-app', id, {
                engine,
                id,
                name,
                url,
                icon,
                version,
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
  });

  ipcMain.on('request-update-app', (e, engine, id, name, url, icon) => {
    Promise.resolve()
      .then(() => { // check if WebCatalog is ready to install app
        if (engine === 'electron') return checkCrossZipReadyAsync();
        return true;
      })
      .then((isReady) => {
        if (!isReady) return;

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
            .then((version) => {
              e.sender.send('set-app', id, {
                version,
                status: 'INSTALLED',
                lastUpdated: new Date().getTime(),
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
    // https://github.com/electron-userland/electron-builder/issues/4046
    // disable updater if user is using AppImageLauncher
    if (process.platform === 'linux' && process.env.DESKTOPINTEGRATION === 'AppImageLauncher') {
      dialog.showMessageBox(mainWindow.get(), {
        type: 'error',
        message: 'Updater is incompatible with AppImageLauncher. Please uninstall AppImageLauncher or download new updates manually from our website.',
        buttons: ['Learn More', 'Go to Website', 'OK'],
        cancelId: 2,
        defaultId: 2,
      }).then(({ response }) => {
        if (response === 0) {
          shell.openExternal('https://github.com/electron-userland/electron-builder/issues/4046');
        } else if (response === 1) {
          shell.openExternal('http://webcatalogapp.com/');
        }
      }).catch(console.log); // eslint-disable-line
      return;
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
