/* global ipcRenderer */

import {
  setAuthToken,
} from './state/root/auth/actions';

import {
  getUser,
  removeUser,
} from './state/root/user/actions';

import {
  openSnackbar,
} from './state/root/snackbar/actions';

import {
  open as openDialogPreferences,
} from './state/dialogs/preferences/actions';


const loadListeners = (store) => {
  ipcRenderer.on('log', (e, message) => {
    // eslint-disable-next-line
    if (message) console.log(message);
  });

  ipcRenderer.on('set-auth-token', (e, token) => {
    store.dispatch(setAuthToken(token));
    if (token && token !== 'anonymous') {
      store.dispatch(getUser());
    } else {
      store.dispatch(removeUser());
    }
  });

  ipcRenderer.on('open-snackbar', (e, message) => {
    store.dispatch(openSnackbar(message));
  });

  ipcRenderer.on('open-about-dialog', () => {
  });

  ipcRenderer.on('open-preferences', () => {
    store.dispatch(openDialogPreferences());
  });
};

export default loadListeners;
