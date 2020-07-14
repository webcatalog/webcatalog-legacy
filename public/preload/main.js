const { remote } = require('electron');
const contextMenu = require('electron-context-menu');

contextMenu({
  window: remote.getCurrentWindow(),
});

window.getContextAppIconPath = (id) => remote.require('path').join(remote.app.getAppPath(), 'default-app-icons', `${id}-icon.png`);
