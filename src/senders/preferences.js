/* global ipcRenderer */

export const getPreferences = () => ipcRenderer.sendSync('get-preferences');

export const requestSetPreference = (name, value) => ipcRenderer.send('request-set-preference', name, value);

export const requestResetPreferences = () => ipcRenderer.send('request-reset-preferences');
