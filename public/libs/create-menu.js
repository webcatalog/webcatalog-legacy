const {
  app,
  Menu,
  shell,
} = require('electron');
const { autoUpdater } = require('electron-updater');

const sendToAllWindows = require('./send-to-all-windows');

const { getPreference } = require('./preferences');

const createMenu = () => {
  const registered = getPreference('registered');
  const updaterEnabled = process.env.SNAP == null && !process.mas && !process.windowsStore;

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
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        {
          label: 'Developer Tools',
          role: 'toggledevtools',
        },
        { type: 'separator' },
        { role: 'togglefullscreen' },
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

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: 'About WebCatalog',
          click: () => sendToAllWindows('open-dialog-about'),
        },
        { type: 'separator' },
        {
          label: registered ? 'Registered' : 'Registration...',
          enabled: !registered,
          click: registered ? null : () => sendToAllWindows('open-license-registration-dialog'),
        },
        {
          type: 'separator',
          visible: updaterEnabled,
        },
        {
          label: 'Check for Updates...',
          click: () => {
            global.updateSilent = false;
            autoUpdater.checkForUpdates();
          },
          visible: updaterEnabled,
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'Cmd+,',
          click: () => sendToAllWindows('go-to-preferences'),
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
  } else {
    // File menu for Windows & Linux
    template.unshift({
      label: 'File',
      submenu: [
        {
          role: 'about',
          click: () => sendToAllWindows('open-dialog-about'),
        },
        { type: 'separator' },
        {
          label: registered ? 'Registered' : 'Registration...',
          enabled: !registered,
          click: registered ? null : () => sendToAllWindows('open-license-registration-dialog'),
        },
        {
          type: 'separator',
          visible: updaterEnabled,
        },
        {
          label: 'Check for Updates...',
          click: () => {
            global.updateSilent = false;
            autoUpdater.checkForUpdates();
          },
          visible: updaterEnabled,
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'Ctrl+,',
          click: () => sendToAllWindows('go-to-preferences'),
        },
        { type: 'separator' },
        { role: 'quit', label: 'Exit' },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

module.exports = createMenu;
