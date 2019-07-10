const {
  app,
  Menu,
  shell,
} = require('electron');

const sendMessageToWindow = require('./send-message-to-window');

const createMenu = () => {
  let currentZoom = 1;
  const ZOOM_INTERVAL = 0.1;

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
        {
          label: 'Find...',
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
          label: 'Reload',
          click: () => {
            sendMessageToWindow('reload');
          },
          accelerator: 'CmdOrCtrl+R',
        },
        { role: 'forcereload' },
        { type: 'separator' },
        {
          label: 'Actual Size',
          accelerator: (() => {
            if (process.platform === 'darwin') {
              return 'Command+0';
            }
            return 'Ctrl+=0';
          })(),
          click: () => {
            currentZoom = 1;
            sendMessageToWindow('change-zoom', currentZoom);
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
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        {
          label: 'Toggle Developer Tools',
          accelerator: (() => {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I';
            }
            return 'Ctrl+Shift+I';
          })(),
          click: () => sendMessageToWindow('toggle-dev-tools'),
        },
        { type: 'separator' },
        {
          label: 'Debug...',
          role: 'toggledevtools',
          accelerator: 'CommandOrControl+Shift+Y',
        },
      ],
    },
    {
      label: 'History',
      submenu: [
        {
          label: 'Home',
          accelerator: 'Alt+H',
          click: () => sendMessageToWindow('go-home'),
        },
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+[',
          click: () => sendMessageToWindow('go-back'),
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+]',
          click: () => sendMessageToWindow('go-forward'),
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => sendMessageToWindow('reload'),
        },
        { type: 'separator' },
        {
          label: 'Copy URL',
          accelerator: 'CmdOrCtrl+L',
          click: () => sendMessageToWindow('copy-url'),
        },
      ],
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () => shell.openExternal('https://secretonapp.com'),
        },
      ],
    },
  ];

  if (process.platform !== 'darwin') {
    template[template.length - 1].submenu.push({
      label: 'About Secreton',
      click: () => sendMessageToWindow('open-about-dialog'),
    });
  }

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: 'About Secreton',
          click: () => sendMessageToWindow('open-about-dialog'),
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

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

module.exports = createMenu;
