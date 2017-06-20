const { ipcRenderer, clipboard, webFrame } = require('electron');

window.ipcRenderer = ipcRenderer;
window.clipboard = clipboard;
window.webFrame = webFrame;
