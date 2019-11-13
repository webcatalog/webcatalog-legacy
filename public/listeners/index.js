const {
  app,
  dialog,
  ipcMain,
  // nativeTheme,
  systemPreferences,
  shell,
} = require('electron');

const sendToAllWindows = require('../libs/send-to-all-windows');
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
    });
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
        app.quit();
      }
    }).catch(console.log); // eslint-disable-line
  });

  ipcMain.on('request-open-install-location', () => {
    const installationPath = getPreference('installationPath').replace('~', app.getPath('home'));
    shell.openItem(installationPath);
  });

  // App Management
  ipcMain.on('request-get-installed-apps', () => {
    getInstalledAppsAsync();
  });

  ipcMain.on('request-open-app', (e, id, name) => openApp(id, name));

  ipcMain.on('request-uninstall-app', (e, id, name) => {
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

        uninstallAppAsync(id, name)
          .then(() => {
            e.sender.send('remove-app', id);
          })
          .catch((error) => {
            /* eslint-disable-next-line */
            console.log(error);
            dialog.showMessageBox(mainWindow.get(), {
              type: 'error',
              message: `Failed to uninstall ${name}. (${error.stack})`,
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

  ipcMain.on('request-install-app', (e, engine, id, name, url, icon, mailtoHandler) => {
    e.sender.send('set-app', id, {
      status: 'INSTALLING',
      engine,
      id,
      name,
      url,
      icon,
      mailtoHandler,
    });

    p = p.then(() => installAppAsync(engine, id, name, url, icon, mailtoHandler)
      .then(() => {
        e.sender.send('set-app', id, {
          version: packageJson.templateVersion,
          status: 'INSTALLED',
        });
      })
      .catch((error) => {
        /* eslint-disable-next-line */
        console.log(error);
        dialog.showMessageBox(mainWindow.get(), {
          type: 'error',
          message: `Failed to install ${name}. (${error.message.includes('is not installed') ? error.message : error.stack})`,
        });
        e.sender.send('remove-app', id);
      }));
  });

  ipcMain.on('request-update-app', (e, engine, id, name, url, icon, mailtoHandler) => {
    e.sender.send('set-app', id, {
      status: 'INSTALLING',
    });

    p = p.then(() => installAppAsync(engine, id, name, url, icon, mailtoHandler)
      .then(() => {
        e.sender.send('set-app', id, {
          version: packageJson.templateVersion,
          status: 'INSTALLED',
        });
      })
      .catch((error) => {
        /* eslint-disable-next-line */
        console.log(error);
        dialog.showMessageBox(mainWindow.get(), {
          type: 'error',
          message: `Failed to update ${name}. (${error.message})`,
        });
        e.sender.send('set-app', id, {
          status: 'INSTALLED',
        });
      }));
  });

  // Native Theme
  ipcMain.on('get-should-use-dark-colors', (e) => {
    /* Electron 7
    e.returnValue = nativeTheme.shouldUseDarkColors;
    */
    const themeSource = getPreference('themeSource');
    if (getPreference('themeSource') === 'system') {
      e.returnValue = systemPreferences.isDarkMode();
    } else {
      e.returnValue = themeSource === 'dark';
    }
  });

  ipcMain.on('get-theme-source', (e) => {
    /* Electron 7
    e.returnValue = nativeTheme.themeSource;
    */
    e.returnValue = getPreference('themeSource');
  });

  ipcMain.on('request-set-theme-source', (e, val) => {
    /* Electron 7
    nativeTheme.themeSource = val;
    */
    setPreference('themeSource', val);
    sendToAllWindows('native-theme-updated');
  });
};

module.exports = loadListeners;
