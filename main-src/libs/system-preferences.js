/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
// System Preferences are not stored in storage but stored in macOS Preferences.
// It can be retrieved and changed using Electron APIs

const { app } = require('electron');
const AutoLaunch = require('auto-launch');
const settings = require('electron-settings');
const { captureException } = require('@sentry/electron');

const sendToAllWindows = require('./send-to-all-windows');

const checkAutoLauncherStatusAsync = () => {
  // check if autolauncher is still functioning on Linux
  // if not show the status in the UI as disabled
  // so the user can attempt to re-enable it
  if (process.platform !== 'linux') return Promise.resolve();
  const value = settings.getSync('systemPreferences.openAtLogin') || 'no';
  if (value.startsWith('yes')) {
    const autoLauncher = new AutoLaunch({
      name: 'WebCatalog',
      isHidden: value === 'yes-hidden',
    });
    return autoLauncher.isEnabled()
      .then((isEnabled) => {
        if (isEnabled) return;
        sendToAllWindows('set-system-preference', 'openAtLogin', 'no');
      })
      .catch((err) => {
        captureException(err);
        sendToAllWindows('set-system-preference', 'openAtLogin', 'no');
      });
  }
  return Promise.resolve();
};

const getSystemPreference = (name) => {
  switch (name) {
    case 'openAtLogin': { // return yes, yes-hidden, no
      // use 3rd-party libary on Linux
      // Electron app.getLoginItemSettings API only supports macOS & Windows
      if (process.platform === 'linux') {
        checkAutoLauncherStatusAsync();
        return settings.getSync('systemPreferences.openAtLogin') || 'no';
      }

      const loginItemSettings = app.getLoginItemSettings();
      const { openAtLogin, openAsHidden } = loginItemSettings;
      if (openAtLogin && openAsHidden) return 'yes-hidden';
      if (openAtLogin) return 'yes';
      return 'no';
    }
    default: {
      return null;
    }
  }
};

const getSystemPreferences = () => ({
  openAtLogin: getSystemPreference('openAtLogin'),
});

const setSystemPreference = (name, value) => {
  switch (name) {
    case 'openAtLogin': {
      // use 3rd-party libary on Linux
      // Electron app.getLoginItemSettings API only supports macOS & Windows
      if (process.platform === 'linux') {
        const currentValue = settings.getSync('systemPreferences.openAtLogin') || 'no';
        Promise.resolve()
          .then(() => {
            if (currentValue.startsWith('yes')) {
              const autoLauncher = new AutoLaunch({
                name: 'WebCatalog',
                isHidden: currentValue === 'yes-hidden',
              });
              return autoLauncher.disable();
            }
            return null;
          })
          .then(() => {
            if (value.startsWith('yes')) {
              const autoLauncher = new AutoLaunch({
                name: 'WebCatalog',
                isHidden: value === 'yes-hidden',
              });
              return autoLauncher.enable();
            }
            return null;
          })
          .catch((err) => captureException(err))
          .then(() => {
            checkAutoLauncherStatusAsync();
          });
      }

      app.setLoginItemSettings({
        openAtLogin: value.startsWith('yes'),
        openAsHidden: value === 'yes-hidden',
      });
      break;
    }
    default: {
      break;
    }
  }
  sendToAllWindows('set-system-preference', name, value);
};

module.exports = {
  getSystemPreference,
  getSystemPreferences,
  setSystemPreference,
};
