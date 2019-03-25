const { app, BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');
const menubar = require('menubar');
const path = require('path');

const { REACT_PATH } = require('../constants');
const { getPreference } = require('../libs/preferences');
const createMenu = require('../libs/create-menu');

let win;
let mb = {};

const get = () => {
  const attachToMenubar = getPreference('attachToMenubar');
  if (attachToMenubar) return mb.window;
  return win;
};

const create = () => {
  const attachToMenubar = getPreference('attachToMenubar');
  if (attachToMenubar) {
    mb = menubar({
      index: REACT_PATH,
      icon: path.resolve(__dirname, '..', 'menubar-icon.png'),
      preloadWindow: true,
    });

    mb.on('after-show', () => {
      createMenu();
    });
    return;
  }


  const { wasOpenedAsHidden } = app.getLoginItemSettings();

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
    show: !wasOpenedAsHidden,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindowState.manage(win);

  win.loadURL(REACT_PATH);

  // Enable swipe to navigate
  const swipeToNavigate = getPreference('swipeToNavigate');
  if (swipeToNavigate) {
    win.on('swipe', (e, direction) => {
      const view = win.getBrowserView();
      if (view) {
        if (direction === 'left') {
          view.webContents.goBack();
        } else if (direction === 'right') {
          view.webContents.goForward();
        }
      }
    });
  }

  // Hide window instead closing on macos
  win.on('close', (e) => {
    if (process.platform === 'darwin' && !win.forceClose) {
      e.preventDefault();
      win.hide();
    }
  });

  win.on('closed', () => {
    win = null;
  });
};

const show = () => {
  const attachToMenubar = getPreference('attachToMenubar');
  if (win == null) {
    create();
  } else if (attachToMenubar) {
    mb.showWindow();
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
