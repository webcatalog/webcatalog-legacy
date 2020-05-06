const { BrowserWindow } = require('electron');
const path = require('path');

const { REACT_PATH } = require('../constants/paths');

let win;

const get = () => win;

const create = (scrollTo) => {
  global.preferencesScrollTo = scrollTo;

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 760,
    height: 600,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '..', 'preload', 'preferences.js'),
    },
  });
  win.setMenuBarVisibility(false);

  win.loadURL(REACT_PATH);

  win.on('closed', () => {
    win = null;
    global.preferencesScrollTo = null;
  });
};

const show = (scrollTo) => {
  if (win == null) {
    create(scrollTo);
  } else if (scrollTo !== global.preferencesScrollTo) {
    win.close();
    create(scrollTo);
  } else {
    win.show();
  }
};

module.exports = {
  get,
  create,
  show,
};
