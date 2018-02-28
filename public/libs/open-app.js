const { app, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

const openApp = (id, name) => {
  if (process.platform === 'darwin') {
    const appPath = path.join(app.getPath('home'), 'Applications', 'WebCatalog Lite Apps', `${name}.app`);
    shell.openItem(appPath);
  }

  if (process.platform === 'linux') {
    exec(`gtk-launch webcatalog-${id}`);
  }
};

module.exports = openApp;
