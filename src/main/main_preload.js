const { ipcRenderer, webFrame } = require('electron');

// disable zoom
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

window.ipcRenderer = ipcRenderer;
