const settings = require('electron-settings');

const sendMessageToWindow = require('./send-message-to-window');

const defaultPreferences = {
  showNavigationBar: true,
};

const getPreferences = () => settings.get('settings', defaultPreferences);

const getPreference = name => settings.get(`settings.${name}`, defaultPreferences[name]);

const setPreference = (name, value) => {
  settings.get(`preferences.${name}`, value);
  sendMessageToWindow('preference', name, value);
};

module.exports = {
  getPreferences,
  getPreference,
  setPreference,
};
