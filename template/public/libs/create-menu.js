const {
  app,
  Menu,
  clipboard,
  shell,
  dialog,
} = require('electron');

const appJson = require('../app.json');

const mainWindow = require('../windows/main');
const preferencesWindow = require('../windows/preferences');
const editWorkspaceWindow = require('../windows/edit-workspace');

const {
  countWorkspaces,
  getWorkspaces,
  getActiveWorkspace,
  getNextWorkspace,
  getPreviousWorkspace,
} = require('./workspaces');

const {
  createWorkspaceView,
  setActiveWorkspaceView,
  removeWorkspaceView,
  clearBrowsingData,
} = require('./workspaces-views');

const {
  getView,
} = require('./views');

const {
  checkForUpdates,
} = require('./updater');

function createMenu() {
  app.setAboutPanelOptions({
    credits: 'Powered by WebCatalog.',
  });

  const template = [
    {
      label: appJson.name,
      submenu: [
        { role: 'about' },
        {
          label: 'Check for Updates...',
          click: () => checkForUpdates(),
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'Cmd+,',
          click: () => preferencesWindow.show(),
        },
        { type: 'separator' },
        {
          label: 'Clear Browsing Data...',
          accelerator: 'CmdOrCtrl+Shift+Delete',
          click: () => {
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
          },
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
    },
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
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'togglefullscreen' },
        {
          label: 'Actual Size',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              contents.setZoomFactor(1);
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
              contents.getZoomFactor((zoomFactor) => {
                contents.setZoomFactor(zoomFactor + 0.1);
              });
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
              contents.getZoomFactor((zoomFactor) => {
                contents.setZoomFactor(zoomFactor - 0.1);
              });
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
          label: 'Developer Tools',
          submenu: [
            {
              label: 'Window',
              click: () => {
                const win = mainWindow.get();
                if (win != null) {
                  if (win.webContents.isDevToolsOpened()) {
                    win.webContents.closeDevTools();
                  } else {
                    win.webContents.openDevTools({ mode: 'detach' });
                  }
                }
              },
            },
            { type: 'separator' },
          ],
        },
      ],
    },
    {
      label: 'History',
      submenu: [
        {
          label: 'Home',
          accelerator: 'Shift+CmdOrCtrl+H',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const activeWorkspace = getActiveWorkspace();
              const homeUrl = activeWorkspace.home || appJson.url;
              win.getBrowserView().webContents.loadURL(homeUrl);
            }
          },
        },
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+[',
          click: () => {
            const win = mainWindow.get();

            if (win != null && win.getBrowserView().webContents.canGoBack()) {
              win.getBrowserView().webContents.goBack();
            }
          },
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+]',
          click: () => {
            const win = mainWindow.get();

            if (win != null && win.getBrowserView().webContents.canGoForward()) {
              win.getBrowserView().webContents.goForward();
            }
          },
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
      ],
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
          label: 'Report an Issue...',
          click: () => shell.openExternal('https://github.com/quanglam2807/webcatalog/issues'),
        },
        {
          label: 'Learn More...',
          click: () => shell.openExternal('https://getwebcatalog.com'),
        },
      ],
    },
  ];

  Object.values(getWorkspaces())
    .sort((a, b) => a.order - b.order)
    .forEach((workspace) => {
      template[4].submenu.push({
        label: workspace.name || `Workspace ${workspace.order + 1}`,
        type: 'checkbox',
        checked: workspace.active,
        click: () => {
          setActiveWorkspaceView(workspace.id);
          createMenu();
        },
        accelerator: `CmdOrCtrl+${workspace.order + 1}`,
      });

      template[2].submenu[7].submenu.push({
        label: workspace.name || `Workspace ${workspace.order + 1}`,
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
        const nextWorkspace = getPreviousWorkspace(currentActiveWorkspace.id);
        setActiveWorkspaceView(nextWorkspace.id);
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
        removeWorkspaceView(activeWorkspace.id);
        createMenu();
      },
    },
    { type: 'separator' },
    {
      label: 'Add Workspace',
      enabled: countWorkspaces() < 9,
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
