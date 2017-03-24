const { Menu, shell, app, dialog, session } = require('electron');
const path = require('path');
const sendMessageToWindow = require('./sendMessageToWindow');

// https://raw.githubusercontent.com/jiahaog/nativefier/development/app/src/components/menu/menu.js
const showAboutWindow = () => {
  const openAboutWindow = require('about-window').default;

  openAboutWindow({
    icon_path: path.join(__dirname, '..', 'www', 'images', 'icon.1024x1024.png'),
    copyright: `Copyright © 2016 - ${new Date().getFullYear()} Quang Lam`,
    win_options: {
      minWidth: 400,
      minHeight: 400,
      maxWidth: 400,
      maxHeight: 400,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
    },
  });
};

function createMenu({
  isDevelopment, isWebView, appName, appId, log,
}) {
  let template;
  if (isWebView) {
    let currentZoom = 1;
    const ZOOM_INTERVAL = 0.1;

    template = [
      {
        label: 'Navigate',
        submenu: [
          {
            label: 'Home',
            accelerator: 'Alt+H',
            click: () => {
              sendMessageToWindow('go-home');
            },
          },
          {
            label: 'Back',
            accelerator: 'CmdOrCtrl+[',
            click: () => {
              sendMessageToWindow('go-back');
            },
          },
          {
            label: 'Forward',
            accelerator: 'CmdOrCtrl+]',
            click: () => {
              sendMessageToWindow('go-forward');
            },
          },
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: () => {
              sendMessageToWindow('reload');
            },
          },
        ],
      },
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
              sendMessageToWindow('copy-url');
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
            label: 'Find in page...',
            accelerator: 'CmdOrCtrl+F',
            click: () => {
              sendMessageToWindow('toggle-find-in-page-dialog');
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
              sendMessageToWindow('go-back');
            },
          },
          {
            label: 'Forward',
            accelerator: 'CmdOrCtrl+]',
            click: () => {
              sendMessageToWindow('go-forward');
            },
          },
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: () => {
              sendMessageToWindow('reload');
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
              sendMessageToWindow('change-zoom', currentZoom);
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
              sendMessageToWindow('change-zoom', currentZoom);
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
            click: () => {
              sendMessageToWindow('toggle-dev-tools');
            },
          },
        ],
      },
      {
        label: 'Tools',
        role: 'tools',
        submenu: [
          {
            label: 'Settings...',
            accelerator: process.platform === 'darwin' ? 'Cmd+,' : 'Ctrl+P',
            click: () => {
              sendMessageToWindow('toggle-setting-dialog');
            },
          },
          {
            type: 'separator',
          },
          {
            label: 'Clear browsing data...',
            click: () => {
              dialog.showMessageBox({
                type: 'warning',
                buttons: ['Yes', 'Cancel'],
                defaultId: 1,
                title: 'Clear cache confirmation',
                message: `This will clear all data (cookies, local storage etc) from ${appName}. Are you sure you wish to proceed?`,
              }, (response) => {
                if (response === 0) {
                  const s = session.fromPartition(`persist:${appId}`);
                  s.clearStorageData((err) => {
                    if (err) {
                      log(`Clearing browsing data err: ${err.message}`);
                      return;
                    }
                    log(`Browsing data of ${appId} cleared.`);
                    sendMessageToWindow('reload');
                  });
                }
              });
            },
          },
        ],
      },
    ];

    if (isDevelopment) {
      template[2].submenu.push(
        {
          type: 'separator',
        },
        {
          label: 'Reload (Container)',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.reload();
            }
          },
        },
        {
          label: 'Toggle Developer Tools (Container)',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.toggleDevTools();
            }
          },
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
    ];
  }

  template.push({
    role: 'window',
    submenu: [
      {
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
    ],
  });

  const helpMenu = {
    role: 'help',
    submenu: [
      {
        label: 'Support',
        click: () => {
          shell.openExternal('https://getwebcatalog.com/support');
        },
      },
      {
        label: 'Donate',
        click: () => {
          shell.openExternal('https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=JZ2Y4F47ZMGHE&lc=US&item_name=WebCatalog&item_number=webcatalog&currency_code=USD');
        },
      },
      {
        label: 'Website',
        click: () => {
          shell.openExternal('https://getwebcatalog.com');
        },
      },
    ],
  };

  if (process.platform !== 'darwin') {
    helpMenu.submenu.push({
      label: 'About WebCatalog',
      click: () => showAboutWindow(),
    });
  }

  template.push(helpMenu);

  if (process.platform === 'darwin') {
    template.unshift({
      submenu: [
        {
          label: 'About WebCatalog',
          click: () => showAboutWindow(),
        },
        {
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: `Hide ${appName}`,
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          accelerator: 'Command+Shift+H',
          role: 'hideothers',
        },
        {
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
        role: 'front',
      // Need babel.js
      /* eslint-disable comma-dangle */
      }
      /* eslint-enable comma-dangle */
    );
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = createMenu;
