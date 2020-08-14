const { remote, ipcRenderer } = require('electron');
const contextMenu = require('electron-context-menu');
const isDev = require('electron-is-dev');

// Activate the Sentry Electron SDK as early as possible in every process.
if (!isDev && ipcRenderer.sendSync('get-preference', 'sentry')) {
  // eslint-disable-next-line global-require
  require('../libs/sentry');
}

contextMenu({
  window: remote.getCurrentWindow(),
});

window.getContextAppIconPath = (id) => remote.require('path').join(remote.app.getAppPath(), 'default-app-icons', `${id}-icon.png`);

window.remote = remote;
window.ipcRenderer = ipcRenderer;
