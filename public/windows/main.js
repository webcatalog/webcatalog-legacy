const { BrowserWindow } = require('electron');
const path = require('path');
const windowStateKeeper = require('electron-window-state');
const isDev = require('electron-is-dev');

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
    minWidth: 500,
    minHeight: 500,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: path.resolve(__dirname, '..', 'libs', 'sentry-session.js'),
    },
  });

  mainWindowState.manage(win);

  win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.resolve(__dirname, '..', 'index.html')}`);

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
