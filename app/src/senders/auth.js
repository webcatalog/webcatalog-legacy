/* global ipcRenderer */

export const requestLogOut = () => ipcRenderer.send('request-log-out');

export const requestReadTokenFromDisk = () => ipcRenderer.send('request-read-token-from-disk');
