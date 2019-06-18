const settings = require('electron-settings');

const sendToAllWindows = require('../libs/send-to-all-windows');

const moveAllAppsAsync = require('../libs/app-management/move-all-apps-async');

// scope
const v = '2018';

const defaultPreferences = {
  theme: 'automatic',
  registered: false,
  installationPath: '~/Applications/WebCatalog Apps',
  requireAdmin: false,
};

const getPreferences = () => Object.assign({}, defaultPreferences, settings.get(`preferences.${v}`, defaultPreferences));

const getPreference = name => settings.get(`preferences.${v}.${name}`, defaultPreferences[name]);

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
