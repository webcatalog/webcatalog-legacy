const {
  app,
  dialog,
  ipcMain,
  shell,
  // nativeTheme,
  systemPreferences,
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
  setWorkspacePicture,
  removeWorkspacePicture,
} = require('../libs/workspaces');

const {
  createWorkspaceView,
  setActiveWorkspaceView,
  removeWorkspaceView,
  clearBrowsingData,
  loadURL,
} = require('../libs/workspaces-views');

const createMenu = require('../libs/create-menu');
const sendToAllWindows = require('../libs/send-to-all-windows');
const { checkForUpdates } = require('../libs/updater');

const mainWindow = require('../windows/main');
const preferencesWindow = require('../windows/preferences');
const editWorkspaceWindow = require('../windows/edit-workspace');
const codeInjectionWindow = require('../windows/code-injection');

const appJson = require('../app.json');

const loadListeners = () => {
  ipcMain.on('request-open-in-browser', (e, url) => {
    shell.openExternal(url);
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

      const offsetTitlebar = process.platform !== 'darwin' || global.showSidebar || global.attachToMenubar ? 0 : 22;
      const x = global.showSidebar ? 68 : 0;
      const y = global.showNavigationBar ? 36 + offsetTitlebar : 0 + offsetTitlebar;

      view.setBounds({
        x,
        y,
        width: contentSize[0] - x,
        height: contentSize[1] - y,
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
    }).then(({ response }) => {
      if (response === 0) {
        resetPreferences();
        ipcMain.emit('request-show-require-restart-dialog');
      }
    }).catch(console.log); // eslint-disable-line
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
    }).then(({ response }) => {
      if (response === 0) {
        app.relaunch();
        app.exit(0);
      }
    })
    .catch(console.log); // eslint-disable-line
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
    createMenu();
  });

  ipcMain.on('request-set-workspace-picture', (e, id, picturePath) => {
    setWorkspacePicture(id, picturePath);
  });

  ipcMain.on('request-remove-workspace-picture', (e, id) => {
    removeWorkspacePicture(id);
  });

  ipcMain.on('request-clear-browsing-data', () => {
    dialog.showMessageBox(preferencesWindow.get() || mainWindow.get(), {
      type: 'question',
      buttons: ['Clear Now', 'Cancel'],
      message: 'Are you sure? All browsing data will be cleared. This action cannot be undone.',
      cancelId: 1,
    }).then(({ response }) => {
      if (response === 0) {
        clearBrowsingData();
      }
    }).catch(console.log); // eslint-disable-line
  });

  ipcMain.on('request-load-url', (e, url, id) => {
    loadURL(url, id);
  });

  ipcMain.on('request-go-home', () => {
    const win = mainWindow.get();

    if (win != null) {
      const activeWorkspace = getActiveWorkspace();
      const contents = win.getBrowserView().webContents;
      contents.loadURL(activeWorkspace.homeUrl || appJson.url);
      win.send('update-can-go-back', contents.canGoBack());
      win.send('update-can-go-forward', contents.canGoForward());
    }
  });

  ipcMain.on('request-go-back', () => {
    const win = mainWindow.get();

    if (win != null) {
      const contents = win.getBrowserView().webContents;
      if (contents.canGoBack()) {
        contents.goBack();
        win.send('update-can-go-back', contents.canGoBack());
        win.send('update-can-go-forward', contents.canGoForward());
      }
    }
  });

  ipcMain.on('request-go-forward', () => {
    const win = mainWindow.get();

    if (win != null) {
      const contents = win.getBrowserView().webContents;
      if (contents.canGoForward()) {
        contents.goForward();
        win.send('update-can-go-back', contents.canGoBack());
        win.send('update-can-go-forward', contents.canGoForward());
      }
    }
  });

  ipcMain.on('request-reload', () => {
    const win = mainWindow.get();

    if (win != null) {
      win.getBrowserView().webContents.reload();
    }
  });

  ipcMain.on('check-for-updates', () => {
    checkForUpdates();
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
