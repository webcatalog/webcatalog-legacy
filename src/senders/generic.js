/* global ipcRenderer */

export const requestOpenInBrowser = url => ipcRenderer.send('request-open-in-browser', url);

export const isChromeInstalled = () => ipcRenderer.sendSync('is-chrome-installed');
