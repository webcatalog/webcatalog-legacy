const { ipcRenderer, webFrame } = require('electron');

// disable zoom
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(1, 1);

window.env = process.env;
window.platform = process.platform;
window.ipcRenderer = ipcRenderer;
