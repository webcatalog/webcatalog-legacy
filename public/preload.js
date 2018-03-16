const {
  remote,
  ipcRenderer,
  webFrame,
} = require('electron');
const path = require('path');

const templatePackageJson = require('../template/package.json');

// disable zoom
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

window.env = process.env;
window.ipcRenderer = ipcRenderer;
window.version = remote.app.getVersion();
window.moleculeVersion = templatePackageJson.version;

const { arch, platform, versions } = process;
window.arch = arch;
window.platform = platform;
window.versions = versions;

window.appPath = remote.app.getAppPath();
window.electronIconPath = path.resolve(__dirname, 'electron-icon.png');

const { dialog } = remote;
window.dialog = dialog;
