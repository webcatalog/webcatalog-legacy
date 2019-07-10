const {
  remote,
  ipcRenderer,
  webFrame,
} = require('electron');

// disable zoom
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

window.env = process.env;
window.ipcRenderer = ipcRenderer;
window.version = remote.app.getVersion();

const { arch, platform, versions } = process;
window.arch = arch;
window.platform = platform;
window.versions = versions;

const { dialog } = remote;
window.dialog = dialog;
