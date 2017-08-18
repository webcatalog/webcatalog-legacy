/* global ipcRenderer */

export const getPreferences = () => ipcRenderer.send('get-preferences');

export const requestSetPreference = (name, value) => ipcRenderer.send('request-set-preference', name, value);
