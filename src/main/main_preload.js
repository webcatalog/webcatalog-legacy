const { ipcRenderer, clipboard, webFrame } = require('electron');

window.ipcRenderer = ipcRenderer;
window.clipboard = clipboard;

webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);
