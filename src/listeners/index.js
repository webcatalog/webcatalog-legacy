import { batch } from 'react-redux';

import { setApp, removeApp, clean as cleanAppManagement } from '../state/app-management/actions';
import { changeRoute } from '../state/router/actions';
import { setPreference } from '../state/preferences/actions';
import { setSystemPreference } from '../state/system-preferences/actions';
import { open as openDialogAbout } from '../state/dialog-about/actions';
import { open as openDialogLicenseRegistration } from '../state/dialog-license-registration/actions';
import { updateUpdater } from '../state/updater/actions';
import {
  updateShouldUseDarkColors,
  updateInstallationProgress,
} from '../state/general/actions';
import {
  getShouldUseDarkColors,
} from '../senders';

import { ROUTE_PREFERENCES } from '../constants/routes';

const loadListeners = (store) => {
  const { ipcRenderer } = window.require('electron');

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

  ipcRenderer.on('set-app-batch', (e, apps) => {
    batch(() => {
      apps.forEach((app) => {
        store.dispatch(setApp(app.id, app));
      });
    });
  });

  ipcRenderer.on('remove-app', (e, id) => store.dispatch(removeApp(id)));

  ipcRenderer.on('set-preference', (e, name, value) => {
    store.dispatch(setPreference(name, value));
  });

  ipcRenderer.on('set-system-preference', (e, name, value) => {
    store.dispatch(setSystemPreference(name, value));
  });

  ipcRenderer.on('go-to-preferences', () => store.dispatch(changeRoute(ROUTE_PREFERENCES)));

  ipcRenderer.on('open-license-registration-dialog', () => {
    store.dispatch(openDialogLicenseRegistration());
  });

  ipcRenderer.on('open-dialog-about', () => {
    store.dispatch(openDialogAbout());
  });

  ipcRenderer.on('native-theme-updated', () => {
    store.dispatch(updateShouldUseDarkColors(getShouldUseDarkColors()));
  });

  ipcRenderer.on('update-updater', (e, updaterObj) => {
    store.dispatch(updateUpdater(updaterObj));
  });

  ipcRenderer.on('update-installation-progress', (e, progress) => {
    store.dispatch(updateInstallationProgress(progress));
  });
};

export default loadListeners;
