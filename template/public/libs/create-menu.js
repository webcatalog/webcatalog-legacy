const {
  Menu,
  clipboard,
  ipcMain,
  shell,
} = require('electron');

const appJson = require('../app.json');

const aboutWindow = require('../windows/about');
const editWorkspaceWindow = require('../windows/edit-workspace');
const goToUrlWindow = require('../windows/go-to-url');
const mainWindow = require('../windows/main');
const notificationsWindow = require('../windows/notifications');
const preferencesWindow = require('../windows/preferences');

const getViewBounds = require('./get-view-bounds');
const { getPreference } = require('./preferences');


const {
  getWorkspaces,
  getActiveWorkspace,
  getNextWorkspace,
  getPreviousWorkspace,
} = require('./workspaces');

const {
  createWorkspaceView,
  setActiveWorkspaceView,
} = require('./workspaces-views');

const {
  getView,
} = require('./views');

const {
  checkForUpdates,
} = require('./updater');

function createMenu() {
  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            const win = mainWindow.get();
            if (win) {
              win.webContents.focus();

              win.send('open-find-in-page');

              const contentSize = win.getContentSize();
              const view = win.getBrowserView();

              view.setBounds(getViewBounds(contentSize, true));
            }
          },
        },
        {
          label: 'Find Next',
          accelerator: 'CmdOrCtrl+G',
          click: () => {
            const win = mainWindow.get();
            win.send('request-back-find-in-page', true);
          },
        },
        {
          label: 'Find Previous',
          accelerator: 'Shift+CmdOrCtrl+G',
          click: () => {
            const win = mainWindow.get();
            win.send('request-back-find-in-page', false);
          },
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: global.sidebar ? 'Hide Sidebar' : 'Show Sidebar',
          accelerator: 'CmdOrCtrl+Alt+S',
          click: () => {
            ipcMain.emit('request-set-preference', null, 'sidebar', !global.sidebar);
            ipcMain.emit('request-realign-active-workspace');
          },
        },
        {
          label: global.navigationBar ? 'Hide Navigation Bar' : 'Show Navigation Bar',
          accelerator: 'CmdOrCtrl+Alt+N',
          enabled: !(process.platform === 'linux' && global.attachToMenubar && !global.sidebar),
          click: () => {
            ipcMain.emit('request-set-preference', null, 'navigationBar', !global.navigationBar);
            ipcMain.emit('request-realign-active-workspace');
          },
        },
        {
          label: (!global.sidebar && !global.navigationBar) || global.titleBar ? 'Hide Title Bar' : 'Show Title Bar',
          accelerator: 'CmdOrCtrl+Alt+T',
          enabled: process.platform === 'darwin' && (global.sidebar || global.navigationBar),
          visible: process.platform === 'darwin',
          click: () => {
            ipcMain.emit('request-set-preference', null, 'titleBar', !global.titleBar);
            ipcMain.emit('request-realign-active-workspace');
          },
        },
        // same behavior as BrowserWindow with autoHideMenuBar: true
        // but with addition to readjust BrowserView so it won't cover the menu bar
        {
          label: 'Toggle menu bar',
          visible: false,
          accelerator: 'Alt+M',
          enabled: process.platform === 'win32' && getPreference('hideMenuBar'),
          click: () => {
            const win = mainWindow.get();
            win.setMenuBarVisibility(!win.isMenuBarVisible());
            ipcMain.emit('request-realign-active-workspace');
          },
        },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        {
          label: 'Actual Size',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              contents.zoomFactor = 1;
            }
          },
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              contents.zoomFactor += 0.1;
            }
          },
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              contents.zoomFactor -= 0.1;
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Reload This Workspace',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              win.getBrowserView().webContents.reload();
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Toggle Developer Tools',
          submenu: [],
        },
      ],
    },
    {
      label: 'History',
      submenu: [
        {
          label: 'Home',
          accelerator: 'Shift+CmdOrCtrl+H',
          click: () => ipcMain.emit('request-go-home'),
        },
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+[',
          click: () => ipcMain.emit('request-go-back'),
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+]',
          click: () => ipcMain.emit('request-go-forward'),
        },
        { type: 'separator' },
        {
          label: 'Copy URL',
          accelerator: 'CmdOrCtrl+L',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const url = win.getBrowserView().webContents.getURL();
              clipboard.writeText(url);
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Go to URL...',
          accelerator: 'CmdOrCtrl+Shift+G',
          click: () => {
            goToUrlWindow.show();
          },
        },
      ],
    },
    {
      label: 'Workspaces',
      submenu: [],
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'WebCatalog Support',
          click: () => shell.openExternal('https://webcatalogapp.com/support'),
        },
        {
          label: 'WebCatalog Website',
          click: () => shell.openExternal('https://webcatalogapp.com'),
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: appJson.name,
      submenu: [
        {
          label: `About ${appJson.name}`,
          click: () => aboutWindow.show(),
        },
        { type: 'separator' },
        {
          label: 'Check for Updates...',
          click: () => checkForUpdates(),
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => preferencesWindow.show(),
        },
        { type: 'separator' },
        {
          label: 'Notifications...',
          click: () => notificationsWindow.show(),
          accelerator: 'CmdOrCtrl+Shift+N',
        },
        { type: 'separator' },
        {
          label: 'Clear Browsing Data...',
          accelerator: 'CmdOrCtrl+Shift+Delete',
          click: () => ipcMain.emit('request-clear-browsing-data'),
        },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });
  } else {
    template.unshift({
      label: 'File',
      submenu: [
        {
          label: 'About',
          click: () => aboutWindow.show(),
        },
        {
          label: 'Check for Updates...',
          click: () => checkForUpdates(),
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => preferencesWindow.show(),
        },
        { type: 'separator' },
        {
          label: 'Notifications...',
          click: () => notificationsWindow.show(),
          accelerator: 'CmdOrCtrl+Shift+N',
        },
        { type: 'separator' },
        {
          label: 'Clear Browsing Data...',
          accelerator: 'CmdOrCtrl+Shift+Delete',
          click: () => ipcMain.emit('request-clear-browsing-data'),
        },
        { type: 'separator' },
        { role: 'quit', label: 'Exit' },
      ],
    });
  }

  Object.values(getWorkspaces())
    .sort((a, b) => a.order - b.order)
    .forEach((workspace, i) => {
      template[4].submenu.push({
        label: workspace.name || `Workspace ${i + 1}`,
        type: 'checkbox',
        checked: workspace.active,
        click: () => {
          setActiveWorkspaceView(workspace.id);
          createMenu();
        },
        accelerator: i < 9 ? `CmdOrCtrl+${i + 1}` : null,
      });

      template[2].submenu[template[2].submenu.length - 1].submenu.push({
        label: workspace.name || `Workspace ${i + 1}`,
        click: () => {
          const v = getView(workspace.id);
          v.webContents.toggleDevTools();
        },
      });
    });

  template[4].submenu.push(
    { type: 'separator' },
    {
      label: 'Select Next Workspace',
      click: () => {
        const currentActiveWorkspace = getActiveWorkspace();
        const nextWorkspace = getNextWorkspace(currentActiveWorkspace.id);
        setActiveWorkspaceView(nextWorkspace.id);
        createMenu();
      },
      accelerator: 'CmdOrCtrl+Shift+]',
    },
    {
      label: 'Select Previous Workspace',
      click: () => {
        const currentActiveWorkspace = getActiveWorkspace();
        const previousWorkspace = getPreviousWorkspace(currentActiveWorkspace.id);
        setActiveWorkspaceView(previousWorkspace.id);
        createMenu();
      },
      accelerator: 'CmdOrCtrl+Shift+[',
    },
    { type: 'separator' },
    {
      label: 'Edit Current Workspace',
      click: () => {
        const activeWorkspace = getActiveWorkspace();
        editWorkspaceWindow.show(activeWorkspace.id);
      },
    },
    {
      label: 'Remove Current Workspace',
      click: () => {
        const activeWorkspace = getActiveWorkspace();
        ipcMain.emit('request-remove-workspace', null, activeWorkspace.id);
      },
    },
    { type: 'separator' },
    {
      label: 'Add Workspace',
      click: () => {
        createWorkspaceView();
        createMenu();
      },
    },
  );

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = createMenu;
