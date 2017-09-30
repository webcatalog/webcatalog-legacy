const {
  remote,
  ipcRenderer,
  webFrame,
} = require('electron');

const packageJson = require('../package.json');

const { webApp } = packageJson;

window.platform = process.platform;
window.packageJson = packageJson;
window.shellInfo = webApp;

// disable zoom
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(1, 1);

window.env = process.env;
window.ipcRenderer = ipcRenderer;
window.version = remote.app.getVersion();

const { arch, platform, versions } = process;
window.arch = arch;
window.platform = platform;
window.versions = versions;
