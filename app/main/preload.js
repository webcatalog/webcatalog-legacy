const { ipcRenderer } = require('electron');

window.PLATFORM = process.platform;
window.ipcRenderer = ipcRenderer;
