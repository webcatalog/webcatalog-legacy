const { BrowserWindow } = require('electron');

let currentId;
let win;

const get = () => win;

const create = (id, url, name) => {
  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 800,
    height: 600,
    autoHideMenuBar: false,
    show: true,
    title: name,
    webPreferences: {
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: true,
    },
  });
  win.setMenuBarVisibility(false);

  win.on('closed', () => {
    win = null;
    currentId = null;
  });

  win.loadURL(url);
};

const show = (id, url, name) => {
  if (win == null) {
    create(id, url, name);
  } else if (id !== currentId) {
    win.close();
    create(id, url, name);
  } else {
    win.show();
  }
};

module.exports = {
  get,
  create,
  show,
};
