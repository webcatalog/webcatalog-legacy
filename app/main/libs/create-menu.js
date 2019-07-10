const { Menu, shell, app } = require('electron');

const sendMessageToWindow = require('./send-message-to-window');
const { getPreference, setPreference } = require('./preferences');

const packageJson = require('../../package.json');

const { webApp } = packageJson;

function createMenu() {
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
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            sendMessageToWindow('open-find-in-page-dialog');
          },
        },
        {
          label: 'Find Next',
          accelerator: 'CmdOrCtrl+G',
          click: () => {
            sendMessageToWindow('find-in-page-next');
          },
        },
        {
          label: 'Find Previous',
          accelerator: 'Shift+CmdOrCtrl+G',
          click: () => {
            sendMessageToWindow('find-in-page-previous');
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
          label: 'Toggle Navigation Bar',
          click: () => {
            const showNavigationBar = getPreference('showNavigationBar');
            setPreference('showNavigationBar', !showNavigationBar);
          },
          accelerator: 'Shift+CmdOrCtrl+N',
        },
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
          click: () => shell.openExternal('https://github.com/webcatalog/appifier'),
        },
      ],
    },
  ];

  if (process.platform !== 'darwin') {
    template[template.length - 1].submenu.push({
      label: `About ${webApp.name}`,
      click: () => sendMessageToWindow('open-about-dialog'),
    });
  }

  if (process.platform === 'linux') {
    template[0].submenu.push({ role: 'separator' });
    template[0].submenu.push({
      label: 'Preferences...',
      accelerator: 'Ctrl+P',
      click: () => sendMessageToWindow('open-preferences-dialog'),
    });

    template.splice(4, 0, {
      label: 'Tools',
      submenu: [
        {
          label: 'Clear Browsing Data...',
          accelerator: 'Ctrl+Shift+Delete',
          click: () => sendMessageToWindow('open-clear-browsing-data-dialog'),
        },
      ],
    });
  }

  if (process.platform === 'win32') {
    template.splice(4, 0, {
      label: 'Tools',
      submenu: [
        {
          label: 'Preferences...',
          accelerator: 'Ctrl+P',
          click: () => sendMessageToWindow('open-preferences-dialog'),
        },
        { type: 'separator' },
        {
          label: 'Clear Browsing Data...',
          accelerator: 'Ctrl+Shift+Delete',
          click: () => sendMessageToWindow('open-clear-browsing-data-dialog'),
        },
      ],
    });
  }

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: `About ${webApp.name}`,
          click: () => sendMessageToWindow('open-about-dialog'),
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'Cmd+,',
          click: () => sendMessageToWindow('open-preferences-dialog'),
        },
        { type: 'separator' },
        {
          label: 'Clear Browsing Data...',
          accelerator: 'Cmd+Shift+Delete',
          click: () => sendMessageToWindow('open-clear-browsing-data-dialog'),
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

    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' },
        ],
      },
    );

    // Window menu
    template[4].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = createMenu;
