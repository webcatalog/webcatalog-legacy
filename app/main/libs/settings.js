const settings = require('electron-settings');

const sendMessageToWindow = require('./sendMessageToWindow');

const defaultSettings = {
  showNavigationBar: true,
};

const getSettings = () => settings.get('settings', defaultSettings);

const getSetting = name => settings.get(`settings.${name}`, defaultSettings[name]);

const setSetting = (name, value) => {
  settings.get(`settings.${name}`, value);
  sendMessageToWindow('setting', name, value);
};

module.exports = {
  getSettings,
  getSetting,
  setSetting,
};
