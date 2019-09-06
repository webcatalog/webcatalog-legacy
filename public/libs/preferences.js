const { app } = require('electron');
const settings = require('electron-settings');
const path = require('path');

const sendToAllWindows = require('./send-to-all-windows');
const isEngineInstalled = require('./is-engine-installed');

// scope
const v = '2018';

const getDefaultInstallationPath = () => {
  if (process.platform === 'darwin') {
    return '~/Applications/WebCatalog Apps';
  }
  if (process.platform === 'linux') {
    return '~/.webcatalog';
  }
  if (process.platform === 'win32') {
    return path.join(app.getPath('home'), 'WebCatalog Apps');
  }
  throw Error('Unsupported platform');
};

const getPreferredEngine = () => {
  if (isEngineInstalled('chrome')) {
    return 'chrome';
  }
  return 'electron';
};

const defaultPreferences = {
  createDesktopShortcut: true,
  createStartMenuShortcut: true,
  installationPath: getDefaultInstallationPath(),
  preferredEngine: getPreferredEngine(),
  registered: false,
  requireAdmin: false,
  hideEnginePrompt: false,
  theme: process.platform === 'darwin' ? 'automatic' : 'light',
};

const getPreferences = () => ({ ...defaultPreferences, ...settings.get(`preferences.${v}`) });

const getPreference = (name) => {
  // ensure compatiblity with old version
  if (process.platform === 'darwin' && (name === 'installationPath' || name === 'requireAdmin')) {
    // old pref, home or root
    if (settings.get('preferences.2018.installLocation') === 'root') {
      settings.delete('preferences.2018.installLocation');

      settings.set(`preferences.${v}.installationPath`, '/Applications/WebCatalog Apps');
      sendToAllWindows('set-preference', 'installationPath', '/Applications/WebCatalog Apps');

      settings.set(`preferences.${v}.requireAdmin`, true);
      sendToAllWindows('set-preference', 'requireAdmin', true);

      if (name === 'installationPath') {
        return '/Applications/WebCatalog Apps';
      }
      return true;
    }
  }

  if (settings.has(`preferences.${v}.${name}`)) {
    return settings.get(`preferences.${v}.${name}`);
  }
  return defaultPreferences[name];
};

const setPreference = (name, value) => {
  settings.set(`preferences.${v}.${name}`, value);
  sendToAllWindows('set-preference', name, value);
};

const resetPreferences = () => {
  settings.deleteAll();

  const preferences = getPreferences();
  Object.keys(preferences).forEach((name) => {
    sendToAllWindows('set-preference', name, preferences[name]);
  });
};

module.exports = {
  getPreference,
  getPreferences,
  resetPreferences,
  setPreference,
};
