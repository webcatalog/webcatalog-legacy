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

const FIND_IN_PAGE_HEIGHT = 42;

function createMenu() {
  app.setAboutPanelOptions({
    credits: 'Powered by WebCatalog.',
  });

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
              win.send('open-find-in-page');

              const contentSize = win.getContentSize();
              const view = win.getBrowserView();

              const offsetTitlebar = global.showSidebar || global.attachToMenubar ? 0 : 22;
              const x = global.showSidebar ? 68 : 0;
              const y = global.showNavigationBar ? 36 + offsetTitlebar : 0 + offsetTitlebar;

              view.setBounds({
                x,
                y: y + FIND_IN_PAGE_HEIGHT,
                height: contentSize[1] - y - FIND_IN_PAGE_HEIGHT,
                width: contentSize[0] - x,
              });
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
              const contents = win.getBrowserView().webContents;
              contents.loadURL(activeWorkspace.homeUrl || appJson.url);
              win.send('update-can-go-back', contents.canGoBack());
              win.send('update-can-go-forward', contents.canGoForward());
            }
          },
        },
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+[',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              if (contents.canGoBack()) {
                contents.goBack();
                win.send('update-can-go-back', contents.canGoBack());
                win.send('update-can-go-forward', contents.canGoForward());
              }
            }
          },
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+]',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              if (contents.canGoForward()) {
                contents.goForward();
                win.send('update-can-go-back', contents.canGoBack());
                win.send('update-can-go-forward', contents.canGoForward());
              }
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
    .forEach((workspace, i) => {
      template[4].submenu.push({
        label: workspace.name || `Workspace ${i + 1}`,
        type: 'checkbox',
        checked: workspace.active,
        click: () => {
          setActiveWorkspaceView(workspace.id);
          createMenu();
        },
        accelerator: `CmdOrCtrl+${i + 1}`,
      });

      template[2].submenu[7].submenu.push({
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

  if (process.platform === 'darwin') {
    template.unshift({
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
    });
  } else {
    template.unshift({
      label: 'File',
      submenu: [
        {
          role: 'about',
          click: () => app.showAboutPanel(),
        },
        {
          label: 'Check for Updates...',
          click: () => checkForUpdates(),
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'Ctrl+,',
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
        { role: 'quit', label: 'Exit' },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = createMenu;
