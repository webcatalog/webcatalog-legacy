const {
  remote,
  ipcRenderer,
  webFrame,
} = require('electron');
const packageJson = require('../package.json');

// disable zoom
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

window.env = process.env;
window.ipcRenderer = ipcRenderer;
window.version = remote.app.getVersion();
window.moleculeVersion = packageJson.dependencies.appifier;

const { arch, platform, versions } = process;
window.arch = arch;
window.platform = platform;
window.versions = versions;

window.appPath = remote.app.getAppPath();
window.desktopPath = remote.app.getPath('desktop');

const { dialog } = remote;
window.dialog = dialog;
