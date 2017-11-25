/* global ipcRenderer */

import {
  setLocalApp,
  removeLocalApp,
} from '../actions/root/local/actions';

import {
  setUpdaterStatus,
} from '../actions/root/updater/actions';

import {
  openSnackbar,
} from '../actions/root/snackbar/actions';
import {
  open as openDialogAbout,
} from '../actions/dialogs/about/actions';


const loadListeners = (store) => {
  ipcRenderer.on('log', (e, message) => {
    // eslint-disable-next-line
    if (message) console.log(message);
  });

  ipcRenderer.on('open-snackbar', (e, message) => {
    store.dispatch(openSnackbar(message));
  });

  ipcRenderer.on('set-local-app', (e, id, status, app) => {
    if (!status) return store.dispatch(removeLocalApp(id));

    return store.dispatch(setLocalApp(id, status, app));
  });

  ipcRenderer.on('set-updater-status', (e, status, info) => {
    if (window.platform === 'linux') return;
    store.dispatch(setUpdaterStatus(status, info || {}));
  });

  ipcRenderer.on('open-about-dialog', () => {
    store.dispatch(openDialogAbout());
  });
};

export default loadListeners;
