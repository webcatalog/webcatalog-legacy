/* global ipcRenderer */

import {
  setAuthToken,
} from './actions/auth';

import {
  openSnackbar,
} from './actions/snackbar';

const loadListeners = (store) => {
  ipcRenderer.on('set-auth-token', (e, token) => {
    store.dispatch(setAuthToken(token));
  });

  ipcRenderer.on('open-snackbar', (e, message) => {
    store.dispatch(openSnackbar(message));
  });
};

export default loadListeners;
