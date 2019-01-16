const { BrowserWindow } = require('electron');
const path = require('path');

const { REACT_PATH } = require('../constants');

const mainWindow = require('./main');

let win;

const get = () => win;

const create = (url) => {
  global.mailtoUrl = url;

  win = new BrowserWindow({
    width: 400,
    height: 530,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '..', 'preload', 'open-email-link-with.js'),
    },
    parent: mainWindow.get(),
  });

  win.loadURL(REACT_PATH);

  win.on('closed', () => {
    win = null;
  });
};

const show = (url) => {
  if (win == null) {
    create(url);
  } else {
    win.close();
    create(url);
  }
};

module.exports = {
  get,
  create,
  show,
};
