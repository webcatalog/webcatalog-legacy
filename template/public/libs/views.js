const { BrowserView, session, shell } = require('electron');
const path = require('path');

const appJson = require('../app.json');

const views = {};

const extractDomain = (fullUrl) => {
  const matches = fullUrl.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  const domain = matches && matches[1];
  return domain ? domain.replace('www.', '') : null;
};

const addView = (browserWindow, workspace) => {
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      partition: `persist:${workspace.id}`,
      preload: path.join(__dirname, '..', 'preload', 'view.js'),
    },
  });

  if (workspace.active) {
    browserWindow.setBrowserView(view);

    const contentSize = browserWindow.getContentSize();
    view.setBounds({
      x: global.showSidebar ? 68 : 0,
      y: 0,
      width: global.showSidebar ? contentSize[0] - 68 : contentSize[0],
      height: contentSize[1],
    });
    view.setAutoResize({
      width: true,
      height: true,
    });
  }

  view.webContents.on('will-navigate', (e, url) => {
    console.log(url);
  });

  view.webContents.on('new-window', (e, nextUrl) => {
    e.preventDefault();

    // open external url in browser if domain doesn't match.
    const curDomain = extractDomain(appJson.url);
    const nextDomain = extractDomain(nextUrl);

    // open new window
    if (
      nextDomain === null
      || nextDomain === curDomain
      || nextDomain === 'accounts.google.com'
      || nextDomain === 'feedly.com'
      || nextUrl.indexOf('oauth') > -1 // Works with Google & Facebook.
    ) {
      view.webContents.loadURL(nextUrl);
      return;
    }

    shell.openExternal(nextUrl);
  });

  view.webContents.loadURL(workspace.home || appJson.url);

  views[workspace.id] = view;
};

const getView = id => views[id];

const setActiveView = (browserWindow, id) => {
  const view = views[id];
  browserWindow.setBrowserView(view);

  const contentSize = browserWindow.getContentSize();
  view.setBounds({
    x: global.showSidebar ? 68 : 0,
    y: 0,
    width: global.showSidebar ? contentSize[0] - 68 : contentSize[0],
    height: contentSize[1],
  });
  view.setAutoResize({
    width: true,
    height: true,
  });
};

const removeView = (id) => {
  const view = views[id];
  session.fromPartition(`persist:${id}`).clearStorageData();
  view.destroy();
};

module.exports = {
  addView,
  getView,
  setActiveView,
  removeView,
};
