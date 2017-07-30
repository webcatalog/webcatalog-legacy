/* global ipcRenderer */

import {
  setAuthToken,
} from './state/auth/actions';

import {
  setManagedApp,
  removeManagedApp,
} from './state/user/apps/managed/actions';

import {
  setUpdaterStatus,
} from './state/updater/actions';

import {
  openSnackbar,
} from './state/ui/snackbar/actions';
import {
  open as openDialogAbout,
} from './state/ui/dialogs/about/actions';


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

  ipcRenderer.on('open-about-dialog', () => {
    store.dispatch(openDialogAbout());
  });
};

export default loadListeners;
