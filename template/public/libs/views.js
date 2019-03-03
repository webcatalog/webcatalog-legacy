const {
  app,
  BrowserView,
  session,
  shell,
} = require('electron');
const path = require('path');

const appJson = require('../app.json');

const { getPreference } = require('./preferences');
const {
  getWorkspace,
  setWorkspace,
} = require('./workspaces');

const sendToAllWindows = require('./send-to-all-windows');

const views = {};

const badgeCounts = {};

const extractDomain = (fullUrl) => {
  const matches = fullUrl.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  const domain = matches && matches[1];
  return domain ? domain.replace('www.', '') : null;
};

const addView = (browserWindow, workspace) => {
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
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

  view.webContents.on('did-start-loading', () => {
    if (getWorkspace(workspace.id).active) {
      sendToAllWindows('update-did-fail-load', false);
      sendToAllWindows('update-is-loading', true);
    }
  });

  view.webContents.on('did-stop-loading', () => {
    if (getWorkspace(workspace.id).active) {
      sendToAllWindows('update-is-loading', false);
    }

    const currentUrl = view.webContents.getURL();
    setWorkspace(workspace.id, {
      lastUrl: currentUrl,
    });
  });

  // https://electronjs.org/docs/api/web-contents#event-did-fail-load
  view.webContents.on('did-fail-load', (e, errorCode, errorDesc, validateUrl, isMainFrame) => {
    if (isMainFrame && errorCode < 0 && errorCode !== -3) {
      if (getWorkspace(workspace.id).active) {
        sendToAllWindows('update-did-fail-load', true);
      }
    }
  });

  view.webContents.on('new-window', (e, nextUrl) => {
    const curDomain = extractDomain(appJson.url);
    const nextDomain = extractDomain(nextUrl);

    // open new window normally if domain is not defined (about:)
    if (nextDomain === null) {
      return;
    }

    e.preventDefault();

    // load in same window
    if (
      nextDomain === curDomain
      || nextDomain === 'accounts.google.com'
      || nextDomain === 'feedly.com'
      || nextUrl.indexOf('oauth') > -1 // Works with Google & Facebook.
    ) {
      view.webContents.loadURL(nextUrl);
      return;
    }

    // open external url in browser if domain doesn't match.
    shell.openExternal(nextUrl);
  });

  // Hide Electron from UA to improve compatibility
  // https://github.com/quanglam2807/webcatalog/issues/182
  let uaStr = view.webContents.getUserAgent();
  uaStr = uaStr.replace(` ${app.getName()}/${app.getVersion()}`, '');
  uaStr = uaStr.replace(` Electron/${process.versions.electron}`, '');
  view.webContents.setUserAgent(uaStr);

  // Unread count badge
  const unreadCountBadge = getPreference('unreadCountBadge');
  if (unreadCountBadge) {
    view.webContents.on('page-title-updated', (e, title) => {
      const itemCountRegex = /[([{](\d*?)[}\])]/;
      const match = itemCountRegex.exec(title);

      const incStr = match ? match[1] : '';
      const inc = parseInt(incStr, 10) || 0;
      badgeCounts[workspace.id] = inc;

      let count = 0;
      Object.values(badgeCounts).forEach((c) => {
        count += c;
      });

      app.setBadgeCount(count);
    });
  }

  // Find In Page
  view.webContents.on('found-in-page', (e, result) => {
    sendToAllWindows('update-find-in-page-matches', result.activeMatchOrdinal, result.matches);
  });

  const rememberLastPageVisited = getPreference('rememberLastPageVisited');
  view.webContents.loadURL((rememberLastPageVisited && workspace.lastUrl) || appJson.url);

  views[workspace.id] = view;
};

const getView = id => views[id];

const setActiveView = (browserWindow, id) => {
  // stop find in page when switching workspaces
  const currentView = browserWindow.getBrowserView();
  currentView.webContents.stopFindInPage('clearSelection');
  browserWindow.send('close-find-in-page');

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

  sendToAllWindows('update-is-loading', view.webContents.isLoading());
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
