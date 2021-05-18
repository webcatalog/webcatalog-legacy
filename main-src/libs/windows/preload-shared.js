/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { remote, ipcRenderer } = require('electron');
const machineId = require('node-machine-id');

// Activate the Sentry Electron SDK as early as possible in every process.
if (process.env.NODE_ENV === 'production' && ipcRenderer.sendSync('get-preference', 'sentry')) {
  // eslint-disable-next-line global-require
  require('../sentry');
}

window.remote = remote;
window.ipcRenderer = ipcRenderer;

window.machineId = machineId.machineIdSync();
