const settings = require('electron-settings');

const sendMessageToWindow = require('./send-message-to-window');

// have version to easily reset preferences in the future
const v = '1.0.0';

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

const getPreferences = () => settings.get(`preferences.${v}`, defaultPreferences);

const getPreference = name => settings.get(`preferences.${v}.${name}`, defaultPreferences[name]);

const setPreference = (name, value) => {
  settings.set(`preferences.${v}.${name}`, value);
  sendMessageToWindow('set-preference', name, value);
};

module.exports = {
  getPreferences,
  getPreference,
  setPreference,
};
