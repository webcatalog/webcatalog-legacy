/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import amplitude from '../amplitude';

import { trackInstallAsync } from '../firebase/functions';

export const enqueueRequestRestartSnackbar = () => window.ipcRenderer.emit('enqueue-request-restart-snackbar');

export const requestOpenInBrowser = (url) => window.ipcRenderer.send('request-open-in-browser', url);
export const requestShowMessageBox = (message, type) => window.ipcRenderer.send('request-show-message-box', message, type);
export const requestQuit = () => window.ipcRenderer.send('request-quit');
export const requestCheckForUpdates = (isSilent) => window.ipcRenderer.send('request-check-for-updates', isSilent);
export const requestShowAppMenu = (x, y) => window.ipcRenderer.send('request-show-app-menu', x, y);
export const requestRestart = () => window.ipcRenderer.send('request-restart');

// Preferences
export const getPreference = (name) => window.ipcRenderer.sendSync('get-preference', name);
export const getPreferences = () => window.ipcRenderer.sendSync('get-preferences');
export const requestSetPreference = (name, value) => window.ipcRenderer.send('request-set-preference', name, value);
export const requestResetPreferences = () => window.ipcRenderer.send('request-reset-preferences');
export const requestOpenInstallLocation = () => window.ipcRenderer.send('request-open-install-location');

// System Preferences
export const getSystemPreference = (name) => window.ipcRenderer.sendSync('get-system-preference', name);
export const getSystemPreferences = () => window.ipcRenderer.sendSync('get-system-preferences');
export const requestSetSystemPreference = (name, value) => window.ipcRenderer.send('request-set-system-preference', name, value);

// App Management
export const requestGetInstalledApps = () => window.ipcRenderer.send('request-get-installed-apps');
export const requestInstallApp = (id, name, url, icon, opts) => {
  // only log engine & app type to protect privacy
  amplitude.getInstance().logEvent('install app', {
    multisiteApp: url == null,
  });

  // only track installs for apps in the catalog
  if (!id.startsWith('custom-')) {
    trackInstallAsync(amplitude.getInstance().options.deviceId, id);
  }

  window.ipcRenderer.send('request-install-app', id, name, url, icon, opts);
};
export const requestUpdateApp = (id, name, url, icon, opts) => {
  // only log engine & app type to protect privacy
  amplitude.getInstance().logEvent('update app', {
    multisiteApp: url == null,
  });

  // only track installs for apps in the catalog
  if (!id.startsWith('custom-')) {
    trackInstallAsync(amplitude.getInstance().options.deviceId, id);
  }

  window.ipcRenderer.send('request-update-app', id, name, url, icon, opts);
};
export const requestCancelInstallApp = (id) => window.ipcRenderer.send('request-cancel-install-app', id);
export const requestCancelUpdateApp = (id) => window.ipcRenderer.send('request-cancel-update-app', id);
export const requestUninstallApp = (id, name, engine) => {
  // only log engine o protect privacy
  amplitude.getInstance().logEvent('uninstall app', {
    engine,
  });
  window.ipcRenderer.send('request-uninstall-app', id, name, engine);
};
export const requestOpenApp = (id, name) => window.ipcRenderer.send('request-open-app', id, name);

// Native Theme
export const getShouldUseDarkColors = () => window.ipcRenderer.sendSync('get-should-use-dark-colors');

// Firebase
export const requestUpdateAuthJson = (authToken) => window.ipcRenderer.send('request-update-auth-json', authToken);
