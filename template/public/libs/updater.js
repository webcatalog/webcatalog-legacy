const { dialog } = require('electron');
const fetch = require('node-fetch');
const semver = require('semver');

const packageJson = require('../../package.json');
const mainWindow = require('../windows/main');
const appJson = require('../app.json');

const checkForUpdates = (silent) => {
  console.log('Checking for updates...'); // eslint-disable-line no-console
  fetch('https://api.github.com/repos/quanglam2807/webcatalog/releases/latest')
    .then((res) => res.json())
    .then((release) => {
      const v = release.tag_name;
      return fetch(`https://raw.githubusercontent.com/quanglam2807/webcatalog/${v}/package.json`);
    })
    .then((res) => res.json())
    .then((fetchedJson) => {
      if (semver.gt(fetchedJson.templateVersion, packageJson.version)) {
        dialog.showMessageBox(mainWindow.get(), {
          type: 'info',
          message: `An update (${appJson.name} ${fetchedJson.templateVersion}) is available. Use the latest version of WebCatalog to update this app.`,
          buttons: ['OK'],
          cancelId: 0,
          defaultId: 0,
        });
      } else if (!silent) {
        dialog.showMessageBox(mainWindow.get(), {
          type: 'info',
          message: `${appJson.name} is up-to-date.`,
          buttons: ['OK'],
          cancelId: 0,
          defaultId: 0,
        });
      }
    })
    .catch(() => {
      if (!silent) {
        dialog.showMessageBox(mainWindow.get(), {
          type: 'error',
          message: 'Failed to check for updates. Please check your Internet connection.',
          buttons: ['OK'],
          cancelId: 0,
          defaultId: 0,
        });
      }
    });
};

module.exports = {
  checkForUpdates,
};
