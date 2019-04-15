const path = require('path');
const { fork } = require('child_process');
const { app, ipcMain } = require('electron');

const sendToAllWindows = require('../../send-to-all-windows');

const moveAllAppsAsync = moveFrom => new Promise((resolve, reject) => {
  sendToAllWindows('update-moving-all-apps', true);

  const scriptPath = path.join(__dirname, 'forked-script.js');

  const params = [
    '--moveFrom',
    moveFrom,
    '--homePath',
    app.getPath('home'),
    '--username',
    process.env.USER, // required by sudo-prompt
  ];

  const child = fork(scriptPath, params, {
    env: {
      ELECTRON_RUN_AS_NODE: 'true',
      ELECTRON_NO_ASAR: 'true',
    },
  });

  child.on('message', (message) => {
    console.log(message);
  });

  child.on('exit', (code) => {
    if (code === 1) {
      sendToAllWindows('update-moving-all-apps', false);
      ipcMain.emit('request-get-installed-apps');
      ipcMain.emit('request-show-message-box', null, 'WebCatalog failed to move your apps to new location. You\'ll have to move them manually.', 'error');
      reject(new Error('Forked script failed to run correctly.'));
      return;
    }

    ipcMain.emit('request-get-installed-apps');
    sendToAllWindows('update-moving-all-apps', false);
    resolve();
  });
});

module.exports = moveAllAppsAsync;
