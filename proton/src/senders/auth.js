/* global ipcRenderer */

export const requestSignInWithGoogle = () => ipcRenderer.send('request-sign-in-with-google');

export const requestSignUp = () => ipcRenderer.send('request-sign-up');
