const { app, dialog, shell } = require('electron');
const semver = require('semver');
const https = require('https');

const sendMessageToWindow = require('./sendMessageToWindow');

const checkForUpdate = ({ mainWindow, isDevelopment, isTesting }) => {
  // Don't run update checker in dev mode
  if (isDevelopment || isTesting) return;

  // Run autoUpdater in any windows
  mainWindow.webContents.once('did-finish-load', () => {
    setTimeout(() => {
      https.get({
        host: 'api.github.com',
        path: '/repos/webcatalog/webcatalog/releases/latest',
        method: 'GET',
        headers: { 'user-agent': `WebCatalog/${app.getVersion()}` },
      }, (res) => {
        if (res.statusCode >= 200 && res.statusCode <= 299) {
          let body = '';
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', () => {
            const { tag_name } = JSON.parse(body);
            const latestVersion = tag_name.slice(1);
            sendMessageToWindow('log', `Lastest version ${latestVersion}`);
            if (semver.gt(latestVersion, app.getVersion())) {
              dialog.showMessageBox({
                type: 'info',
                buttons: ['Yes', 'Cancel'],
                defaultId: 1,
                title: 'A new update is ready to install',
                message: `WebCatalog ${latestVersion} is now available. Do you want to go to the website and download now?`,
              }, (response) => {
                if (response === 0) {
                  shell.openExternal('https://getwebcatalog.com');
                }
              });
            }
          });
        }
      }).on('error', (err) => {
        sendMessageToWindow('log', `Update checker: ${err.message}`);
      });
    }, 1000);
  });
};

module.exports = checkForUpdate;
