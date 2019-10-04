const path = require('path');
const settings = require('electron-settings');
const { app } = require('electron');

const sendToAllWindows = require('../libs/send-to-all-windows');

const appJson = require('../app.json');

const getDefaultDownloadsPath = () => {
  if (process.platform === 'darwin') {
    return path.join(app.getPath('home'), 'Downloads');
  }
  throw Error('Unsupported platform');
};

// scope
const v = '2018.2';


const defaultPreferences = {
  askForDownloadPath: true,
  attachToMenubar: false,
  autoCheckForUpdates: true,
  cssCodeInjection: null,
  downloadPath: getDefaultDownloadsPath(),
  jsCodeInjection: null,
  navigationBar: false,
  rememberLastPageVisited: false,
  shareWorkspaceBrowsingData: false,
  sidebar: Boolean(appJson.mailtoHandler),
  spellChecker: true,
  swipeToNavigate: true,
  theme: process.platform === 'darwin' ? 'automatic' : 'light',
  unreadCountBadge: true,
};

const getPreferences = () => ({ ...defaultPreferences, ...settings.get(`preferences.${v}`) });

const getPreference = (name) => {
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
