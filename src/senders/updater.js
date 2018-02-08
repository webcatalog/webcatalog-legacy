/* global ipcRenderer */

export const requestCheckForUpdates = () => ipcRenderer.send('request-check-for-updates');

export const requestQuitAndInstall = () => ipcRenderer.send('request-quit-and-install');
