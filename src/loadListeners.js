/* global ipcRenderer */

import {
  setAuthToken,
} from './state/auth/actions';

import {
  setLocalApp,
  removeLocalApp,
} from './state/local/actions';

import {
  setUpdaterStatus,
} from './state/updater/actions';

import {
  openSnackbar,
} from './state/snackbar/actions';
import {
  open as openDialogAbout,
} from './state/dialogs/about/actions';


const loadListeners = (store) => {
  ipcRenderer.on('log', (e, message) => {
    // eslint-disable-next-line
    console.log(message);
  });

  ipcRenderer.on('set-auth-token', (e, token) => {
    store.dispatch(setAuthToken(token));
  });

  ipcRenderer.on('open-snackbar', (e, message) => {
    store.dispatch(openSnackbar(message));
  });

  ipcRenderer.on('set-local-app', (e, id, status, app) => {
    if (!status) return store.dispatch(removeLocalApp(id));

    return store.dispatch(setLocalApp(id, status, app));
  });

  ipcRenderer.on('set-updater-status', (e, status, info) => {
    store.dispatch(setUpdaterStatus(status));
    // eslint-disable-next-line
    console.log(info);
  });

  ipcRenderer.on('open-about-dialog', () => {
    store.dispatch(openDialogAbout());
  });
};

export default loadListeners;
