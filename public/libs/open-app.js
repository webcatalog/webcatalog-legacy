const { app, shell } = require('electron');
const path = require('path');

const openApp = (id, name) => {
  const appPath = path.join(app.getPath('home'), 'Applications', 'Juli Apps', `${name}.app`);
  shell.openItem(appPath);
};

module.exports = openApp;
