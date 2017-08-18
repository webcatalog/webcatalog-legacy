/* global ipcRenderer */

export const requestLogOut = () => ipcRenderer.send('request-log-out');

export const requestReadTokenFromDisk = () => ipcRenderer.send('request-read-token-from-disk');

export const requestWriteTokenToDisk = token => ipcRenderer.send('request-write-token-to-disk', token);

export const requestSignInWithGoogle = () => ipcRenderer.send('request-sign-in-with-google');

export const requestSignUp = () => ipcRenderer.send('request-sign-up');
