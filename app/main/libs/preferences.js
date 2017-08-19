const settings = require('electron-settings');

const sendMessageToWindow = require('./send-message-to-window');

const defaultPreferences = {
  darkTheme: false,
  showNavigationBar: true,
  navigationBarPosition: 'left',
  swipeToNavigate: true,
  useHardwareAcceleration: true,
  userAgent: null,
  injectCSS: '',
  injectJS: '',
};

const getPreferences = () => settings.get('settings', defaultPreferences);

const getPreference = name => settings.get(`settings.${name}`, defaultPreferences[name]);

const setPreference = (name, value) => {
  settings.get(`preferences.${name}`, value);
  sendMessageToWindow('set-preference', name, value);
};

module.exports = {
  getPreferences,
  getPreference,
  setPreference,
};
