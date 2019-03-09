const { BrowserWindow } = require('electron');
const path = require('path');

const { REACT_PATH } = require('../constants');

const mainWindow = require('./main');

let win;
let activeType = null;

const get = () => win;

const create = (type) => {
  activeType = type;

  global.codeInjectionType = type;

  win = new BrowserWindow({
    width: 400,
    height: 400,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '..', 'preload', 'code-injection.js'),
    },
    parent: mainWindow.get(),
  });

  win.loadURL(REACT_PATH);

  win.on('closed', () => {
    win = null;
  });
};

const show = (id) => {
  if (win == null) {
    create(id);
  } else if (id !== activeType) {
    win.close();
    create(id);
  } else {
    win.show();
  }
};

module.exports = {
  get,
  create,
  show,
};
