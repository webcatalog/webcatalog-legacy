/* global ipcRenderer */

import {
  setAuthToken,
} from '../state/root/auth/actions';

import {
  getUser,
  removeUser,
} from '../state/root/user/actions';

import {
  setUpdaterStatus,
} from '../state/root/updater/actions';

import {
  openSnackbar,
} from '../state/root/snackbar/actions';
import {
  open as openDialogAbout,
} from '../state/dialogs/about/actions';


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

  ipcRenderer.on('set-updater-status', (e, status, info) => {
    store.dispatch(setUpdaterStatus(status, info || {}));
  });

  ipcRenderer.on('open-about-dialog', () => {
    store.dispatch(openDialogAbout());
  });
};

export default loadListeners;
