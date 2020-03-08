const {
  app,
  Menu,
  shell,
  ipcMain,
} = require('electron');

const sendToAllWindows = require('./send-to-all-windows');

const { getPreference } = require('./preferences');
const formatBytes = require('./format-bytes');

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
        { role: 'togglefullscreen' },
        { type: 'separator' },
        {
          role: 'toggledevtools',
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
          label: 'WebCatalog Support',
          click: () => shell.openExternal('https://webcatalogapp.com/support'),
        },
        {
          label: 'Report a Bug via GitHub...',
          click: () => shell.openExternal('https://github.com/
atomery/webcatalog/issues'),
        },
        {
          label: 'Request a New Feature via GitHub...',
          click: () => shell.openExternal('https://github.com/
atomery/webcatalog/issues/new?template=feature.md&title=feature%3A+'),
        },
        {
          label: 'Submit New App to Catalog...',
          click: () => shell.openExternal('https://github.com/
atomery/webcatalog/issues/new?template=app.md&title=app%3A+'),
        },
        {
          label: 'Learn More...',
          click: () => shell.openExternal('https://webcatalogapp.com'),
        },
      ],
    },
  ];

  const updaterMenuItem = {
    label: 'Check for Updates...',
    click: () => ipcMain.emit('request-check-for-updates'),
    visible: updaterEnabled,
  };
  if (global.updaterObj && global.updaterObj.status === 'update-downloaded') {
    updaterMenuItem.label = 'Restart to Apply Updates...';
  } else if (global.updaterObj && global.updaterObj.status === 'update-available') {
    updaterMenuItem.label = 'Downloading Updates...';
    updaterMenuItem.enabled = false;
  } else if (global.updaterObj && global.updaterObj.status === 'download-progress') {
    const { transferred, total, bytesPerSecond } = global.updaterObj.info;
    updaterMenuItem.label = `Downloading Updates (${formatBytes(transferred)}/${formatBytes(total)} at ${formatBytes(bytesPerSecond)}/s)...`;
    updaterMenuItem.enabled = false;
  } else if (global.updaterObj && global.updaterObj.status === 'checking-for-update') {
    updaterMenuItem.label = 'Checking for Updates...';
    updaterMenuItem.enabled = false;
  }

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
        updaterMenuItem,
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
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
        updaterMenuItem,
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
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
