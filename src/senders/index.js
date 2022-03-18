/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ipcRenderer } from 'electron';

import amplitude from '../amplitude';

import { trackInstallAsync } from '../api/functions';

export const enqueueRequestRestartSnackbar = () => ipcRenderer.emit('enqueue-request-restart-snackbar');

export const requestOpenInBrowser = (url) => ipcRenderer.send('request-open-in-browser', url);
export const requestShowMessageBox = (message, type) => ipcRenderer.send('request-show-message-box', message, type);
export const requestQuit = () => ipcRenderer.send('request-quit');
export const requestCheckForUpdates = (isSilent) => ipcRenderer.send('request-check-for-updates', isSilent);
export const requestShowAppMenu = (x, y) => ipcRenderer.send('request-show-app-menu', x, y);
export const requestRestart = () => ipcRenderer.send('request-restart');

// Preferences
export const getPreference = (name) => ipcRenderer.sendSync('get-preference', name);
export const getPreferences = () => ipcRenderer.sendSync('get-preferences');
export const requestSetPreference = (name, value) => ipcRenderer.send('request-set-preference', name, value);
export const requestResetPreferences = () => ipcRenderer.send('request-reset-preferences');
export const requestOpenInstallLocation = () => ipcRenderer.send('request-open-install-location');

// System Preferences
export const getSystemPreference = (name) => ipcRenderer.sendSync('get-system-preference', name);
export const getSystemPreferences = () => ipcRenderer.sendSync('get-system-preferences');
export const requestSetSystemPreference = (name, value) => ipcRenderer.send('request-set-system-preference', name, value);

// App Management
export const requestGetInstalledApps = () => ipcRenderer.send('request-get-installed-apps');
export const requestInstallApp = (id, name, url, icon, opts, applyIconTemplate) => {
  // only log engine & app type to protect privacy
  amplitude.getInstance().logEvent('install app', {
    multisiteApp: url == null,
  });

  // only track installs for apps in the catalog
  if (!id.startsWith('custom-')) {
    trackInstallAsync(amplitude.getInstance().options.deviceId, id);
  }

  ipcRenderer.send('request-install-app', id, name, url, icon, opts, applyIconTemplate);
};
export const requestInstallAppWithIconData = (id, name, url, iconFilename, iconData, opts) => {
  // only log engine & app type to protect privacy
  amplitude.getInstance().logEvent('restore app', {
    multisiteApp: url == null,
  });

  // only track installs for apps in the catalog
  if (!id.startsWith('custom-')) {
    trackInstallAsync(amplitude.getInstance().options.deviceId, id);
  }

  ipcRenderer.send('request-install-app-with-icon-data', id, name, url, iconFilename, iconData, opts);
};
export const requestUpdateApp = (id, name, url, icon, opts, applyIconTemplate) => {
  // only log engine & app type to protect privacy
  amplitude.getInstance().logEvent('update app', {
    multisiteApp: url == null,
  });

  // only track installs for apps in the catalog
  if (!id.startsWith('custom-')) {
    trackInstallAsync(amplitude.getInstance().options.deviceId, id);
  }

  ipcRenderer.send('request-update-app', id, name, url, icon, opts, applyIconTemplate);
};
export const requestCancelInstallApp = (id) => ipcRenderer.send('request-cancel-install-app', id);
export const requestCancelUpdateApp = (id) => ipcRenderer.send('request-cancel-update-app', id);
export const requestUninstallApp = (id, name, engine) => {
  // only log engine o protect privacy
  amplitude.getInstance().logEvent('uninstall app', {
    engine,
  });
  ipcRenderer.send('request-uninstall-app', id, name, engine);
};
export const requestOpenApp = (id, name) => ipcRenderer.send('request-open-app', id, name);

// Native Theme
export const getShouldUseDarkColors = () => ipcRenderer.sendSync('get-should-use-dark-colors');
