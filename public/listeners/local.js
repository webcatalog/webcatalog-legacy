const {
  ipcMain,
} = require('electron');

const installAppAsync = require('../libs/install-app-async');

const loadLocalListeners = () => {
  let p = Promise.resolve();

  ipcMain.on('request-install-app', (e, appObj) => {
    e.sender.send('set-local-app', appObj.id, 'INSTALLING', appObj);

    p = p.then(() => installAppAsync(appObj))
      .then(finalizedAppObj => e.sender.send('set-local-app', appObj.id, 'INSTALLED', finalizedAppObj))
      .catch((err) => {
        e.sender.send('log', err.stack);
        e.sender.send('set-local-app', appObj.id, null);
      });
  });
};

module.exports = loadLocalListeners;
