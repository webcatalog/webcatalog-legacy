const { ipcRenderer } = require('electron');
const webApp = require('../package.json').webApp;

window.PLATFORM = process.platform;
window.ipcRenderer = ipcRenderer;
window.shellInfo = webApp;
