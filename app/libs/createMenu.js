// https://raw.githubusercontent.com/jiahaog/nativefier/development/app/src/components/menu/menu.js
/* eslint-disable import/no-extraneous-dependencies */

const electron = require('electron');

const { Menu, shell, clipboard, app, dialog } = electron;


function createMenu({
  isWebView, appName, appId, mainWindow, log,
}) {
  let template;
  if (isWebView) {
    let currentZoom = 1;
    const ZOOM_INTERVAL = 0.1;

    template = [
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo',
          },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo',
          },
          {
            type: 'separator',
          },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut',
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy',
          },
          {
            label: 'Copy Current URL',
            accelerator: 'CmdOrCtrl+L',
            click: () => {
              const currentURL = mainWindow.webContents.getURL();
              clipboard.writeText(currentURL);
            },
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste',
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall',
          },
          {
            type: 'separator',
          },
          {
            label: 'Clear browsing data',
            click: () => {
              dialog.showMessageBox(mainWindow, {
                type: 'warning',
                buttons: ['Yes', 'Cancel'],
                defaultId: 1,
                title: 'Clear cache confirmation',
                message: `This will clear all data (cookies, local storage etc) from ${appName}. Are you sure you wish to proceed?`,
              }, (response) => {
                if (response === 0) {
                  const session = mainWindow.webContents.session;
                  session.clearStorageData((err) => {
                    if (err) {
                      log(`Clearing browsing data err: ${err.message}`);
                      return;
                    }
                    log(`Browsing data of ${appId} cleared.`);
                    mainWindow.webContents.reload();
                  });
                }
              });
            },
          },
        ],
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Back',
            accelerator: 'CmdOrCtrl+[',
            click: () => {
              mainWindow.webContents.goBack();
            },
          },
          {
            label: 'Forward',
            accelerator: 'CmdOrCtrl+]',
            click: () => {
              mainWindow.webContents.goForward();
            },
          },
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                focusedWindow.reload();
              }
            },
          },
          {
            type: 'separator',
          },
          {
            label: 'Toggle Full Screen',
            accelerator: (() => {
              if (process.platform === 'darwin') {
                return 'Ctrl+Command+F';
              }
              return 'F11';
            })(),
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
              }
            },
          },
          {
            label: 'Zoom In',
            accelerator: (() => {
              if (process.platform === 'darwin') {
                return 'Command+=';
              }
              return 'Ctrl+=';
            })(),
            click: () => {
              currentZoom += ZOOM_INTERVAL;
              mainWindow.webContents.send('change-zoom', currentZoom);
            },
          },
          {
            label: 'Zoom Out',
            accelerator: (() => {
              if (process.platform === 'darwin') {
                return 'Command+-';
              }
              return 'Ctrl+-';
            })(),
            click: () => {
              currentZoom -= ZOOM_INTERVAL;
              mainWindow.webContents.send('change-zoom', currentZoom);
            },
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: (() => {
              if (process.platform === 'darwin') {
                return 'Alt+Command+I';
              }
              return 'Ctrl+Shift+I';
            })(),
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                focusedWindow.toggleDevTools();
              }
            },
          },
        ],
      },
      {
        label: 'Window',
        role: 'window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize',
          },
          {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close',
          },
        ],
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'Website',
            click: () => {
              shell.openExternal('https://getwebcatalog.com');
            },
          },
          {
            label: 'Report an Issue',
            click: () => {
              shell.openExternal('https://github.com/webCatalog/desktop/issues');
            },
          },
        ],
      },
    ];

    if (process.platform === 'darwin') {
      template.unshift({
        label: appName,
        submenu: [
          {
            label: `About ${appName}`,
            role: 'about',
          },
          {
            label: 'Services',
            role: 'services',
            submenu: [],
          },
          {
            type: 'separator',
          },
          {
            label: 'Hide App',
            accelerator: 'Command+H',
            role: 'hide',
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            role: 'hideothers',
          },
          {
            label: 'Show All',
            role: 'unhide',
          },
          {
            type: 'separator',
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: () => {
              app.quit();
            },
          },
        ],
      });
      template[3].submenu.push(
        {
          type: 'separator',
        },
        {
          label: 'Bring All to Front',
          role: 'front',
        // Need babel.js
        /* eslint-disable comma-dangle */
        }
        /* eslint-enable comma-dangle */
      );
    }
  } else {
    template = [
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo',
          },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo',
          },
          {
            type: 'separator',
          },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut',
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy',
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste',
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall',
          },
        ],
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Toggle Full Screen',
            accelerator: (() => {
              if (process.platform === 'darwin') {
                return 'Ctrl+Command+F';
              }
              return 'F11';
            })(),
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
              }
            },
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: (() => {
              if (process.platform === 'darwin') {
                return 'Alt+Command+I';
              }
              return 'Ctrl+Shift+I';
            })(),
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                focusedWindow.toggleDevTools();
              }
            },
          },
        ],
      },
      {
        label: 'Window',
        role: 'window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize',
          },
          {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close',
          },
        ],
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'Website',
            click: () => {
              shell.openExternal('https://getwebcatalog.com');
            },
          },
          {
            label: 'Support',
            click: () => {
              shell.openExternal('https://getwebcatalog.com/support');
            },
          },
        ],
      },
    ];

    if (process.platform === 'darwin') {
      template.unshift({
        label: 'WebCatalog',
        submenu: [
          {
            label: `About ${appName}`,
            role: 'about',
          },
          {
            label: 'Services',
            role: 'services',
            submenu: [],
          },
          {
            type: 'separator',
          },
          {
            label: 'Hide App',
            accelerator: 'Command+H',
            role: 'hide',
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            role: 'hideothers',
          },
          {
            label: 'Show All',
            role: 'unhide',
          },
          {
            type: 'separator',
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: () => {
              app.quit();
            },
          },
        ],
      });
      template[3].submenu.push(
        {
          type: 'separator',
        },
        {
          label: 'Bring All to Front',
          role: 'front',
        // Need babel.js
        /* eslint-disable comma-dangle */
        }
        /* eslint-enable comma-dangle */
      );
    }
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = createMenu;
