const { ipcMain } = require('electron');
const {
  getSettings,
  setSetting,
} = require('../libs/settings');

const loadSettingsListeners = () => {
  ipcMain.on('get-settings', (e) => {
    const settings = getSettings();
    e.returnValue = settings;
  });

  ipcMain.on('set-setting', (e, name, value) => {
    e.sender.send(setSetting(name, value));
  });
};

module.exports = loadSettingsListeners;
