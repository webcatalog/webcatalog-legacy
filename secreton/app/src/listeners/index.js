/* global ipcRenderer */

import {
  setUpdaterStatus,
} from '../state/root/updater/actions';

import {
  openSnackbar,
} from '../state/root/snackbar/actions';
import {
  open as openDialogAbout,
} from '../state/dialogs/about/actions';
import {
  STRING_BROWSING_HISTORY_ERASED,
} from '../constants/strings';

const loadListeners = (store) => {
  ipcRenderer.on('log', (e, message) => {
    // eslint-disable-next-line
    if (message) console.log(message);
  });

  ipcRenderer.on('open-snackbar', (e, message) => {
    store.dispatch(openSnackbar(message));
  });

  ipcRenderer.on('set-updater-status', (e, status, info) => {
    if (window.platform === 'linux') return;
    store.dispatch(setUpdaterStatus(status, info || {}));
  });

  ipcRenderer.on('open-about-dialog', () => {
    store.dispatch(openDialogAbout());
  });

  ipcRenderer.on('erase-finished', () => {
    store.dispatch(openSnackbar(STRING_BROWSING_HISTORY_ERASED));
  });
};

export default loadListeners;
