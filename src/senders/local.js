/* global ipcRenderer */

export const requestInstallApp = appObj => ipcRenderer.send('request-install-app', appObj);
