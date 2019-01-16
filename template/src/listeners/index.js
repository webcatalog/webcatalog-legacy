import { setPreference } from '../state/preferences/actions';
import { setWorkspace } from '../state/workspaces/actions';

const { ipcRenderer } = window.require('electron');

const loadListeners = (store) => {
  ipcRenderer.on('log', (e, message) => {
    // eslint-disable-next-line
    if (message) console.log(message);
  });

  ipcRenderer.on('set-preference', (e, name, value) => {
    store.dispatch(setPreference(name, value));
  });

  ipcRenderer.on('set-workspace', (e, id, value) => {
    store.dispatch(setWorkspace(id, value));
  });
};

export default loadListeners;
