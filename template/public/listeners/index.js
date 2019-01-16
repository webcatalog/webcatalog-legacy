const {
  app,
  dialog,
  ipcMain,
  shell,
} = require('electron');

const {
  getPreference,
  getPreferences,
  resetPreferences,
  setPreference,
} = require('../libs/preferences');

const {
  getWorkspaces,
  getWorkspace,
  setWorkspace,
} = require('../libs/workspaces');

const {
  createWorkspaceView,
  setActiveWorkspaceView,
  removeWorkspaceView,
  clearBrowsingData,
  loadURL,
} = require('../libs/workspaces-views');

const createMenu = require('../libs/create-menu');

const mainWindow = require('../windows/main');
const preferencesWindow = require('../windows/preferences');
const editWorkspaceWindow = require('../windows/edit-workspace');

const appJson = require('../app.json');

const loadListeners = () => {
  ipcMain.on('request-open-in-browser', (e, url) => {
    shell.openExternal(url);
  });

  ipcMain.on('request-open-webcatalog', () => {
    shell.openItem('/Applications/WebCatalog 14.app');
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

  ipcMain.on('request-reset-preferences', () => {
    dialog.showMessageBox(preferencesWindow.get(), {
      type: 'question',
      buttons: ['Reset Now', 'Cancel'],
      message: 'Are you sure? All preferences will be restored to their original defaults. Browsing data won\'t be affected. This action cannot be undone.',
      cancelId: 1,
    }, (response) => {
      if (response === 0) {
        resetPreferences();
      }
    });
  });

  ipcMain.on('request-show-preferences-window', () => {
    preferencesWindow.show();
  });

  ipcMain.on('request-show-edit-workspace-window', (e, id) => {
    editWorkspaceWindow.show(id);
  });

  ipcMain.on('request-show-require-restart-dialog', () => {
    dialog.showMessageBox(preferencesWindow.get(), {
      type: 'question',
      buttons: ['Restart Now', 'Later'],
      message: 'You need to restart the app for this change to take affect.',
      cancelId: 1,
    }, (response) => {
      if (response === 0) {
        app.relaunch();
        app.quit();
      }
    });
  });


  // Workspaces
  ipcMain.on('get-workspace', (e, id) => {
    const val = getWorkspace(id);
    e.returnValue = val;
  });

  ipcMain.on('get-workspaces', (e) => {
    const workspaces = getWorkspaces();
    e.returnValue = workspaces;
  });

  ipcMain.on('request-create-workspace', () => {
    createWorkspaceView();
    createMenu();
  });

  ipcMain.on('request-set-active-workspace', (e, id) => {
    setActiveWorkspaceView(id);
    createMenu();
  });

  ipcMain.on('request-remove-workspace', (e, id) => {
    removeWorkspaceView(id);
    createMenu();
  });

  ipcMain.on('request-set-workspace', (e, id, opts) => {
    setWorkspace(id, opts);
  });

  ipcMain.on('request-clear-browsing-data', () => {
    dialog.showMessageBox(preferencesWindow.get() || mainWindow.get(), {
      type: 'question',
      buttons: ['Clear Now', 'Cancel'],
      message: 'Are you sure? All browsing data will be cleared. This action cannot be undone.',
      cancelId: 1,
    }, (response) => {
      if (response === 0) {
        clearBrowsingData();
      }
    });
  });

  ipcMain.on('request-load-url', (e, url, id) => {
    loadURL(url, id);
  });

  ipcMain.on('request-go-home', (e, id) => {
    loadURL(appJson.url, id);
  });
};

module.exports = loadListeners;
