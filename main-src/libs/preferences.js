/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const path = require('path');
const semver = require('semver');
const settings = require('electron-settings');
const { app, nativeTheme, ipcMain } = require('electron');
const fs = require('fs-extra');

const sendToAllWindows = require('./send-to-all-windows');

// scope
const v = '2018';

const getDefaultInstallationPath = () => {
  if (process.platform === 'darwin') {
    return path.join('~', 'Applications', 'WebCatalog Apps');
  }
  if (process.platform === 'linux') {
    return '~/.webcatalog';
  }
  if (process.platform === 'win32') {
    return path.join(app.getPath('home'), 'WebCatalog Apps');
  }
  throw Error('Unsupported platform');
};

const defaultPreferences = {
  allowPrerelease: Boolean(semver.prerelease(app.getVersion())),
  attachToMenubar: false,
  createDesktopShortcut: true,
  createStartMenuShortcut: true,
  defaultHome: 'home',
  hideEnginePrompt: true,
  installationPath: getDefaultInstallationPath(),
  licenseKey: null,
  preferredEngine: 'electron',
  privacyConsentAsked: false,
  proxyBypassRules: '',
  proxyPacScript: '',
  proxyRules: '',
  proxyType: 'none',
  registered: false,
  requireAdmin: false,
  sentry: false,
  sortInstalledAppBy: 'last-updated',
  telemetry: false,
  themeSource: 'system',
  useHardwareAcceleration: true,
};

let cachedPreferences = null;

const initCachedPreferences = () => {
  cachedPreferences = { ...defaultPreferences, ...settings.getSync(`preferences.${v}`) };

  // disable menu bar mode on Windows/Linux
  if (process.platform !== 'darwin') {
    cachedPreferences.attachToMenubar = false;
  }
};

const getPreferences = () => {
  // trigger electron-settings before app ready might fail
  // so catch with default pref as fallback
  // https://github.com/nathanbuchar/electron-settings/issues/111
  try {
    // store in memory to boost performance
    if (cachedPreferences == null) {
      initCachedPreferences();
    }
    return cachedPreferences;
  } catch {
    return defaultPreferences;
  }
};

const setPreference = (name, value) => {
  sendToAllWindows('set-preference', name, value);
  cachedPreferences[name] = value;
  Promise.resolve().then(() => settings.setSync(`preferences.${v}.${name}`, value));

  if (name === 'registered' && value === true) {
    ipcMain.emit('request-get-installed-apps');
  }

  if (name === 'themeSource') {
    nativeTheme.themeSource = value;
  }

  if (name === 'telemetry' || name === 'sentry') {
    // shared-preferences.json includes:
    // telemetry & sentry pref
    // so that privacy consent prefs
    // can be shared across WebCatalog and WebCatalog-Engine-based apps
    const sharedPreferencesPath = path.join(app.getPath('home'), '.webcatalog', 'shared-preferences.json');
    fs.writeJSONSync(sharedPreferencesPath, {
      telemetry: cachedPreferences.telemetry,
      sentry: cachedPreferences.sentry,
    });
  }
};

const getPreference = (name) => {
  // trigger electron-settings before app ready might fail
  // so catch with default pref as fallback
  // https://github.com/nathanbuchar/electron-settings/issues/111
  try {
    // ensure compatiblity with old version
    if (process.platform === 'darwin' && (name === 'installationPath' || name === 'requireAdmin')) {
      // old pref, home or root
      if (settings.getSync('preferences.2018.installLocation') === 'root') {
        settings.unsetSync('preferences.2018.installLocation');

        setPreference('installationPath', '/Applications/WebCatalog Apps');
        setPreference('requireAdmin', true);

        if (name === 'installationPath') {
          return '/Applications/WebCatalog Apps';
        }
        return true;
      }
    }

    // store in memory to boost performance
    if (cachedPreferences == null) {
      initCachedPreferences();
    }
    return cachedPreferences[name];
  } catch {
    return defaultPreferences[name];
  }
};

const resetPreferences = () => {
  cachedPreferences = null;
  settings.unsetSync();

  const preferences = getPreferences();
  sendToAllWindows('set-preferences', preferences);
};

module.exports = {
  getPreference,
  getPreferences,
  resetPreferences,
  setPreference,
};
