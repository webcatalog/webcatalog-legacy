/* global ipcRenderer */

// request
export const requestOpenInBrowser = url => ipcRenderer.send('request-open-in-browser', url);

// has returned value
export const isFullScreen = () => ipcRenderer.sendSync('is-full-screen');
