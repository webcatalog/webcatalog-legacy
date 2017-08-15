const os = require('os');
const { app, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

const openApp = (id, name) => {
  switch (os.platform()) {
    case 'darwin': {
      const appPath = path.join(app.getPath('home'), 'Applications', 'WebCatalog Apps', `${name}.app`);
      shell.openItem(appPath);
      break;
    }
    case 'linux': {
      exec(`gtk-launch webcatalog-${id}`);
      break;
    }
    case 'win32':
    default: {
      const shortcutPath = path.join(app.getPath('home'), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps', `${name}.lnk`);
      shell.openItem(shortcutPath);
    }
  }
};

module.exports = openApp;
