const os = require('os');
const { app, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

const openApp = (id, name) => {
  switch (os.platform()) {
    case 'darwin': {
      const appPath = path.join(app.getPath('home'), 'Applications', 'Appifier Apps', `${name}.app`);
      shell.openItem(appPath);
      break;
    }
    case 'linux': {
      exec(`gtk-launch appifier-${id}`);
      break;
    }
    case 'win32':
    default: {
      const shortcutPath = path.join(app.getPath('userData'), 'Apps', id, `${name}.exe`);
      shell.openItem(shortcutPath);
    }
  }
};

module.exports = openApp;
