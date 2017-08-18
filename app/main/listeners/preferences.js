const { ipcMain } = require('electron');
const {
  getPreferences,
  setPreference,
} = require('../libs/preferences');

const loadPreferencesListeners = () => {
  ipcMain.on('get-preferences', (e) => {
    const preferences = getPreferences();
    e.returnValue = preferences;
  });

  ipcMain.on('request-set-preference', (e, name, value) => {
    e.sender.send(setPreference(name, value));
  });
};

module.exports = loadPreferencesListeners;
