import { setApp, removeApp, clean as cleanAppManagement } from '../state/app-management/actions';
import { changeRoute } from '../state/router/actions';
import { setPreference } from '../state/preferences/actions';
import { open as openDialogAbout } from '../state/dialog-about/actions';
import { open as openDialogLicenseRegistration } from '../state/dialog-license-registration/actions';
import { updateMovingAllApps } from '../state/general/actions';

import { ROUTE_PREFERENCES } from '../constants/routes';

const { ipcRenderer } = window.require('electron');

const loadListeners = (store) => {
  ipcRenderer.on('log', (e, message) => {
    // eslint-disable-next-line
    if (message) console.log(message);
  });

  ipcRenderer.on('clean-app-management', () => {
    store.dispatch(cleanAppManagement());
  });

  ipcRenderer.on('set-app', (e, id, app) => {
    store.dispatch(setApp(id, app));
  });

  ipcRenderer.on('remove-app', (e, id) => store.dispatch(removeApp(id)));

  ipcRenderer.on('set-preference', (e, name, value) => {
    store.dispatch(setPreference(name, value));
  });

  ipcRenderer.on('go-to-preferences', () => store.dispatch(changeRoute(ROUTE_PREFERENCES)));

  ipcRenderer.on('open-license-registration-dialog', () => {
    store.dispatch(openDialogLicenseRegistration());
  });

  ipcRenderer.on('update-moving-all-apps', (e, val) => {
    store.dispatch(updateMovingAllApps(val));
  });

  ipcRenderer.on('open-dialog-about', () => {
    store.dispatch(openDialogAbout());
  });
};

export default loadListeners;
