const { app, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');

const sendToAllWindows = require('./send-to-all-windows');
const { createMenu } = require('./create-menu');

const mainWindow = require('../windows/main');

global.updateSilent = true;

global.updaterObj = {};

autoUpdater.on('checking-for-update', () => {
  global.updaterObj = {
    status: 'checking-for-update',
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});

autoUpdater.on('update-available', (info) => {
  if (!global.updateSilent) {
    dialog.showMessageBox({
      title: 'An Update is Available',
      message: 'There is an available update. It is being downloaded. We will let you know when it is ready.',
      buttons: ['OK', 'What\'s New'],
      cancelId: 0,
      defaultId: 0,
    })
      .then(({ response }) => {
        if (response === 1) {
          shell.openExternal('https://webcatalog.app/release-notes?utm_source=webcatalog_app');
        }
      })
      .catch(console.log); // eslint-disable-line
    global.updateSilent = true;
  }

  global.updaterObj = {
    status: 'update-available',
    info,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});

autoUpdater.on('update-not-available', (info) => {
  if (!global.updateSilent) {
    dialog.showMessageBox({
      title: 'No Updates',
      message: 'There are currently no updates available.',
      buttons: ['OK'],
      cancelId: 0,
      defaultId: 0,
    }).catch(console.log); // eslint-disable-line
    global.updateSilent = true;
  }

  global.updaterObj = {
    status: 'update-not-available',
    info,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});

autoUpdater.on('error', (err) => {
  if (!global.updateSilent) {
    dialog.showMessageBox({
      title: 'Failed to Check for Updates',
      message: 'Failed to check for updates. Please check your Internet connection.',
      buttons: ['OK'],
      cancelId: 0,
      defaultId: 0,
    }).catch(console.log); // eslint-disable-line
    global.updateSilent = true;
  }

  sendToAllWindows('log', err);
  global.updaterObj = {
    status: 'error',
    info: err,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});

autoUpdater.on('update-cancelled', () => {
  global.updaterObj = {
    status: 'update-cancelled',
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});

autoUpdater.on('download-progress', (progressObj) => {
  global.updaterObj = {
    status: 'download-progress',
    info: progressObj,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});

autoUpdater.on('update-downloaded', (info) => {
  global.updaterObj = {
    status: 'update-downloaded',
    info,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();

  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later', 'What\'s New'],
    title: 'Application Update',
    detail: `A new version (${info.version}) has been downloaded. Restart the application to apply the updates.`,
    cancelId: 1,
  };

  dialog.showMessageBox(dialogOpts)
    .then(({ response }) => {
      if (response === 2) {
        shell.openExternal('https://webcatalog.app/release-notes?utm_source=webcatalog_app');
      } else if (response === 0) {
        // Fix autoUpdater.quitAndInstall() does not quit immediately
        // https://github.com/electron/electron/issues/3583
        // https://github.com/electron-userland/electron-builder/issues/1604
        setImmediate(() => {
          app.removeAllListeners('window-all-closed');
          if (mainWindow.get() != null) {
            mainWindow.get().close();
          }
          autoUpdater.quitAndInstall(false);
        });
      }
    })
    .catch(console.log); // eslint-disable-line
});
