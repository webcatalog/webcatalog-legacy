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
  getSystemPreference,
  getSystemPreferences,
  setSystemPreference,
} = require('../libs/system-preferences');

const {
  getActiveWorkspace,
  getWorkspace,
  getWorkspaces,
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
const codeInjectionWindow = require('../windows/code-injection');

const appJson = require('../app.json');

const loadListeners = () => {
  ipcMain.on('request-open-in-browser', (e, url) => {
    shell.openExternal(url);
  });

  ipcMain.on('request-open-webcatalog', () => {
    shell.openItem('/Applications/WebCatalog 14.app');
  });

  // Find In Page
  ipcMain.on('request-find-in-page', (e, text, forward) => {
    const contents = mainWindow.get().getBrowserView().webContents;
    contents.findInPage(text, {
      forward,
    });
  });

  ipcMain.on('request-stop-find-in-page', (e, close) => {
    const win = mainWindow.get();
    const view = win.getBrowserView();
    const contents = view.webContents;
    contents.stopFindInPage('clearSelection');

    win.send('update-find-in-page-matches', 0, 0);

    // adjust bounds to hide the gap for find in page
    if (close) {
      const contentSize = win.getContentSize();

      view.setBounds({
        x: global.showSidebar ? 68 : 0,
        y: 0,
        height: contentSize[1],
        width: global.showSidebar ? contentSize[0] - 68 : contentSize[0],
      });
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

  ipcMain.on('request-show-code-injection-window', (e, type) => {
    codeInjectionWindow.show(type);
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
    dialog.showMessageBox({
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

  ipcMain.on('request-open-url-in-workspace', (e, url, id) => {
    if (id) {
      // if id is defined, switch to that workspace
      setActiveWorkspaceView(id);
      createMenu();
    } else {
      // if not, create a new workspace
      createWorkspaceView();
      createMenu();
    }

    // load url in the current workspace
    const activeWorkspace = getActiveWorkspace();
    loadURL(url, activeWorkspace.id);
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
