const semver = require('semver');
const https = require('https');
const { app, dialog, shell } = require('electron');

// determine if Squirrel (auto-updater) should be used or not
const shouldUseSquirrel = (isWebView) => {
  if (process.platform === 'linux') return false;

  // https://github.com/Squirrel/Squirrel.Windows/issues/282
  if (process.platform === 'windows' && process.arch !== 'x64') return false;

  if (isWebView === true) return false;

  return true;
};

const checkForUpdate = ({ mainWindow, log, isWebView, isDevelopment, isTesting }) => {
  // Don't run update checker in dev mode
  if (isDevelopment || isTesting) return;

  // Run autoUpdater in any windows
  mainWindow.webContents.once('did-finish-load', () => {
    setTimeout(() => {
      // Auto updater
      if (shouldUseSquirrel(isWebView)) {
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
              log(`Lastest version ${latestVersion}`);
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
          log(`Update checker: ${err.message}`);
        });
      }
    }, 1000);
  });
};

module.exports = checkForUpdate;
