/* global ipcRenderer */

export const requestOpenInBrowser = url => ipcRenderer.send('request-open-in-browser', url);
