/* global ipcRenderer */

// request
export const requestOpenInBrowser = url => ipcRenderer.send('request-open-in-browser', url);

// has returned value
export const isFullScreen = () => ipcRenderer.sendSync('is-full-screen');

export const requestForceReload = () => ipcRenderer.send('request-force-reload');

export const requestRelaunch = () => ipcRenderer.send('request-relaunch');

export const requestClearBrowsingData = () => ipcRenderer.send('request-clear-browsing-data');

export const getWebViewPreloadPath = () => ipcRenderer.sendSync('get-web-view-preload-path');

export const writeToClipboard = text => ipcRenderer.send('write-to-clipboard', text);

export const setBadge = text => ipcRenderer.send('badge', text);
