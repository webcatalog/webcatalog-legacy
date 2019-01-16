const { BrowserWindow } = require('electron');
const path = require('path');

const { REACT_PATH } = require('../constants');

const mainWindow = require('./main');

let win;

const get = () => win;

const create = () => {
  win = new BrowserWindow({
    width: 500,
    height: 400,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '..', 'preload', 'preferences.js'),
    },
    parent: mainWindow.get(),
  });

  win.loadURL(REACT_PATH);

  win.on('closed', () => {
    win = null;
  });
};

const show = () => {
  if (win == null) {
    create();
  } else {
    win.show();
  }
};

module.exports = {
  get,
  create,
  show,
};
