/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ipcRenderer } from 'electron';
import { batch } from 'react-redux';

import {
  setApp,
  removeApp,
  clean as cleanAppManagement,
  setScanningForInstalled,
} from '../state/app-management/actions';
import { changeRoute } from '../state/router/actions';
import { setPreference, setPreferences } from '../state/preferences/actions';
import { setSystemPreference } from '../state/system-preferences/actions';
import { open as openDialogAbout } from '../state/dialog-about/actions';
import { open as openDialogBackup } from '../state/dialog-backup/actions';
import { open as openDialogRestore } from '../state/dialog-restore/actions';
import { open as openDialogLicenseRegistration } from '../state/dialog-license-registration/actions';
import { open as openDialogCatalogAppDetails } from '../state/dialog-catalog-app-details/actions';
import { updateUpdater } from '../state/updater/actions';
import {
  updateInstallationProgress,
  updateIsFullScreen,
  updateIsMaximized,
  updateShouldUseDarkColors,
} from '../state/general/actions';
import {
  getShouldUseDarkColors,
} from '../senders';

import { ROUTE_PREFERENCES } from '../constants/routes';

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

  ipcRenderer.on('set-preferences', (e, newState) => {
    store.dispatch(setPreferences(newState));
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

  ipcRenderer.on('open-dialog-backup', () => {
    store.dispatch(openDialogBackup());
  });

  ipcRenderer.on('open-dialog-restore', () => {
    store.dispatch(openDialogRestore());
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

  ipcRenderer.on('set-scanning-for-installed', (e, scanning) => {
    store.dispatch(setScanningForInstalled(scanning));
  });

  ipcRenderer.on('open-dialog-catalog-app-details', (e, appId) => {
    store.dispatch(openDialogCatalogAppDetails(appId));
  });

  ipcRenderer.on('set-is-full-screen', (e, isFullScreen) => {
    store.dispatch(updateIsFullScreen(isFullScreen));
  });

  ipcRenderer.on('set-is-maximized', (e, isMaximized) => {
    store.dispatch(updateIsMaximized(isMaximized));
  });
};

export default loadListeners;
