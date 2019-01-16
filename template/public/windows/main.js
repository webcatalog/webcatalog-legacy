const { BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');

const { REACT_PATH } = require('../constants');

let win;

const get = () => win;

const create = () => {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 768,
  });

  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minHeight: 100,
    title: global.appJson.name,
    titleBarStyle: global.showSidebar ? 'hidden' : 'default',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindowState.manage(win);

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

const send = (...args) => {
  if (win !== null) {
    win.webContents.send(...args);
  }
};

module.exports = {
  create,
  get,
  send,
  show,
};
