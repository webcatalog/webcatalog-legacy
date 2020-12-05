/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { remote, ipcRenderer } = require('electron');
const contextMenu = require('electron-context-menu');
const machineId = require('node-machine-id');

// Activate the Sentry Electron SDK as early as possible in every process.
if (process.env.NODE_ENV === 'production' && ipcRenderer.sendSync('get-preference', 'sentry')) {
  // eslint-disable-next-line global-require
  require('../sentry');
}

contextMenu({
  window: remote.getCurrentWindow(),
});

window.remote = remote;
window.ipcRenderer = ipcRenderer;

window.optOutTelemetry = !ipcRenderer.sendSync('get-preference', 'telemetry');
window.machineId = machineId.machineIdSync();
