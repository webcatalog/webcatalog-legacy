const {
  ipcMain,
} = require('electron');

const openApp = require('../libs/openApp');
const scanInstalledAsync = require('../libs/scanInstalledAsync');
const uninstallAppAsync = require('../libs/uninstallAppAsync');

const loadLocalListeners = () => {
  ipcMain.on('scan-installed-apps', (e) => {
    scanInstalledAsync()
      .then((installedApps) => {
        installedApps.forEach((installedApp) => {
          e.sender.send('set-local-app', installedApp.id, 'INSTALLED', installedApp);
        });
      })
      .catch(err => e.sender.send('log', err));
  });

  ipcMain.on('open-app', (e, id, name) => {
    openApp(id, name);
  });

  ipcMain.on('uninstall-app', (e, id, name) => {
    e.sender.send('set-local-app', id, 'UNINSTALLING');

    uninstallAppAsync(id, name, { shouldClearStorageData: true })
      .then(() => e.sender.send('set-local-app', id, null))
      .catch(() => e.sender.send('set-local-app', id, 'INSTALLED'));
  });
};

module.exports = loadLocalListeners;
