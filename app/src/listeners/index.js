/* global ipcRenderer */

import {
  setAuthToken,
} from '../state/root/auth/actions';

import {
  getUser,
  removeUser,
} from '../state/root/user/actions';

import {
  openSnackbar,
} from '../state/root/snackbar/actions';

import {
  setPreference,
} from '../state/root/preferences/actions';

import {
  open as openDialogAbout,
} from '../state/dialogs/about/actions';

import {
  open as openDialogPreferences,
} from '../state/dialogs/preferences/actions';

import {
  open as openDialogClearBrowsingData,
} from '../state/dialogs/clear-browsing-data/actions';

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
    store.dispatch(openDialogAbout());
  });

  ipcRenderer.on('open-preferences-dialog', () => {
    store.dispatch(openDialogPreferences());
  });

  ipcRenderer.on('open-clear-browsing-data-dialog', () => {
    store.dispatch(openDialogClearBrowsingData());
  });

  ipcRenderer.on('set-preference', (e, name, value) => {
    store.dispatch(setPreference(name, value));
  });
};

export default loadListeners;
