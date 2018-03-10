/* global ipcRenderer */

export const requestOpenInBrowser = url => ipcRenderer.send('request-open-in-browser', url);

export const isBrowserInstalled = (browser, shareData) => ipcRenderer.sendSync('is-chrome-installed', browser, shareData);
