/* global ipcRenderer */

import { setAuthToken } from './actions/auth';

const loadListeners = (store) => {
  ipcRenderer.on('set-auth-token', (e, token) => {
    store.dispatch(setAuthToken(token));
  });
};

export default loadListeners;
