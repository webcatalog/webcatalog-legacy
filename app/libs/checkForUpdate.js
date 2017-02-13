/* eslint-disable import/no-extraneous-dependencies */

const semver = require('semver');
const https = require('https');
const { app, dialog, shell } = require('electron');

const checkForUpdate = (mainWindow, log) => {
  // Run autoUpdater in any windows
  mainWindow.webContents.once('did-finish-load', () => {
    setTimeout(() => {
      // Auto updater
      if (process.platform === 'win32') {
        /* eslint-disable global-require */
        const autoUpdater = require('electron-auto-updater').autoUpdater;
        /* eslint-enable global-require */
        autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName) => {
          dialog.showMessageBox({
            type: 'info',
            buttons: ['Yes', 'Cancel'],
            defaultId: 1,
            title: 'A new update is ready to install',
            message: `Version ${releaseName} is downloaded and will be automatically installed. Do you want to quit the app to install it now?`,
          }, (response) => {
            if (response === 0) {
              autoUpdater.quitAndInstall();
            }
          });
        });

        autoUpdater.addListener('error', err => log(`Update error: ${err.message}`));
        autoUpdater.on('checking-for-update', () => log('Checking for update'));
        autoUpdater.on('update-available', () => log('Update available'));
        autoUpdater.on('update-not-available', () => log('No update available'));

        autoUpdater.checkForUpdates();
      } else {
        https.get('https://backend.getwebcatalog.com/latest.json', (res) => {
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            let body = '';
            res.on('data', (chunk) => {
              body += chunk;
            });
            res.on('end', () => {
              const latestVersion = JSON.parse(body).version;
              log(`Lastest version ${latestVersion}`);
              if (semver.gt(latestVersion, app.getVersion())) {
                dialog.showMessageBox(mainWindow, {
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
          log(`Update checker: ${err.message}`);
        });
      }
    }, 1000);
  });
};

module.exports = checkForUpdate;
