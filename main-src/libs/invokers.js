/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcMain,
  app,
} = require('electron');
const machineId = require('node-machine-id');

const getRelatedPaths = require('./app-management/get-related-paths');
const { getPreference } = require('./preferences');

const loadInvokers = () => {
  ipcMain.handle('get-related-paths', (e, appObj) => {
    const relatedPaths = getRelatedPaths({
      appObj,
      installationPath: getPreference('installationPath'),
      homePath: app.getPath('home'),
      appDataPath: app.getPath('appData'),
      userDataPath: app.getPath('userData'),
      desktopPath: app.getPath('desktop'),
    });
    return Promise.resolve(relatedPaths);
  });

  ipcMain.handle('get-machine-id', () => machineId.machineIdSync());
};

module.exports.load = loadInvokers;
