/* global ipcRenderer */

import {
  setAuthToken,
} from './actions/auth';

import {
  setManagedApp,
  removeManagedApp,
} from './actions/core';

import {
  setUpdaterStatus,
} from './actions/updater';

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

  ipcRenderer.on('set-managed-app', (e, id, status, app) => {
    if (!status) return store.dispatch(removeManagedApp(id));

    return store.dispatch(setManagedApp(id, status, app));
  });

  ipcRenderer.on('set-updater-status', (e, status, info) => {
    store.dispatch(setUpdaterStatus(status));
    // eslint-disable-next-line
    console.log(info);
  });
};

export default loadListeners;
