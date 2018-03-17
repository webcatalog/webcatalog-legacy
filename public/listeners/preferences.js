const { ipcMain } = require('electron');
const {
  getPreferences,
  resetPreferences,
  setPreference,
} = require('../libs/preferences');

const loadPreferencesListeners = () => {
  ipcMain.on('get-preferences', (e) => {
    const preferences = getPreferences();
    e.returnValue = preferences;
  });

  ipcMain.on('request-set-preference', (e, name, value) => {
    setPreference(name, value);
  });

  ipcMain.on('request-reset-preferences', () => {
    resetPreferences();
  });
};

module.exports = loadPreferencesListeners;
