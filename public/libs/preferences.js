const settings = require('electron-settings');

const sendToAllWindows = require('../libs/send-to-all-windows');

const moveAllAppsAsync = require('../libs/app-management/move-all-apps-async');

// scope
const v = '2018';

const defaultPreferences = {
  theme: process.platform === 'darwin' ? 'automatic' : 'light',
  registered: false,
  installationPath: process.platform === 'darwin' ? '~/Applications/WebCatalog Apps' : '~/.webcatalog',
  requireAdmin: false,
};

const getPreferences = () => Object.assign({}, defaultPreferences, settings.get(`preferences.${v}`, defaultPreferences));

const getPreference = (name) => {
  // ensure compatiblity with old version
  if (process.platform === 'darwin' && (name === 'installationPath' || name === 'requireAdmin')) {
    // old pref, home or root
    if (settings.get('preferences.2018.installLocation', null) === 'root') {
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

  return settings.get(`preferences.${v}.${name}`, defaultPreferences[name]);
};

const setPreference = (name, value) => {
  if (name === 'installationPath') {
    const moveFrom = getPreference('installationPath');
    const moveTo = value;
    const requireAdmin = getPreference('requireAdmin');
    moveAllAppsAsync(moveFrom, moveTo, requireAdmin);
  }

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
