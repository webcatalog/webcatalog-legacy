const fs = require('fs-extra');
const path = require('path');
const {
  app,
  ipcMain,
} = require('electron');

const configPath = path.resolve(app.getPath('home'), '.webcatalogrc');

const loadAuthListeners = () => {
  ipcMain.on('log-out', (e) => {
    fs.remove(configPath)
      .then(() => {
        e.sender.send('set-auth-token', null);
      })
      // eslint-disable-next-line
      .catch(console.log);
  });

  ipcMain.on('read-token-from-disk', (e) => {
    // Try to load token
    fs.readJson(configPath)
      .then((token) => {
        e.sender.send('set-auth-token', token);
      })
      // eslint-disable-next-line
      .catch(() => {
        e.sender.send('set-auth-token', null);
      });
  });
};

module.exports = loadAuthListeners;
