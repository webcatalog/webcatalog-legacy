const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');
const {
  app,
  ipcMain,
} = require('electron');

const configPath = path.resolve(app.getPath('home'), '.webcatalogrc');

const sendMessageToWindow = require('../libs/send-message-to-window');

const loadAuthListeners = () => {
  ipcMain.on('request-log-out', (e) => {
    fs.remove(configPath)
      .then(() => {
        e.sender.send('set-auth-token', null);
      })
      // eslint-disable-next-line
      .catch(console.log);
  });

  ipcMain.on('request-read-token-from-disk', (e) => {
    // Try to load token
    fs.readJson(configPath)
      .then(({ token }) => {
        e.sender.send('set-auth-token', token);
      })
      // eslint-disable-next-line
      .catch(() => {
        e.sender.send('set-auth-token', null);
      });
  });

  chokidar.watch(configPath).on('all', () => {
    console.log('ok');
    // Try to load token
    fs.readJson(configPath)
      .then(({ token }) => {
        sendMessageToWindow('set-auth-token', token);
      })
      // eslint-disable-next-line
      .catch((err) => {
        sendMessageToWindow('set-auth-token', null);
      });
  });
};

module.exports = loadAuthListeners;
