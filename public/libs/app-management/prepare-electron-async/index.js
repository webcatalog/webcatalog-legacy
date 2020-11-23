/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');
const envPaths = require('env-paths');
const { addBreadcrumb } = require('@sentry/electron');

const { getPreferences } = require('../../preferences');
const sendToAllWindows = require('../../send-to-all-windows');

// force re-extract for first installation after launch
global.forceExtract = true;

const prepareElectronAsync = () => new Promise((resolve, reject) => {
  const cacheRoot = envPaths('webcatalog', {
    suffix: '',
  }).cache;

  const scriptPath = path.join(__dirname, 'forked-script.js')
    .replace('app.asar', 'app.asar.unpacked');

  const {
    proxyPacScript,
    proxyRules,
    proxyType,
  } = getPreferences();

  const args = [
    '--cacheRoot',
    cacheRoot,
    '--platform',
    process.platform,
    '--arch',
    process.arch,
  ];

  addBreadcrumb({
    category: 'run-forked-script',
    message: 'prepare-electron-async',
    data: {
      cacheRoot,
    },
  });

  const child = fork(scriptPath, args, {
    env: {
      ELECTRON_RUN_AS_NODE: 'true',
      ELECTRON_NO_ASAR: 'true',
      APPDATA: app.getPath('appData'),
      PROXY_PAC_SCRIPT: proxyPacScript,
      PROXY_RULES: proxyRules,
      PROXY_TYPE: proxyType,
      FORCE_EXTRACT: Boolean(global.forceExtract).toString(),
    },
  });

  let err = null;
  child.on('message', (message) => {
    if (message && message.progress) {
      sendToAllWindows('update-installation-progress', message.progress);
    } else if (message && message.error) {
      err = new Error(message.error.message);
      err.stack = message.error.stack;
      err.name = message.error.name;
    } else {
      console.log(message); // eslint-disable-line no-console
    }
  });

  child.on('exit', (code) => {
    if (code === 1) {
      reject(err || new Error('Forked script failed to run correctly.'));
      return;
    }

    // // extracting template code successful so need to re-extract next time
    global.forceExtract = false;

    resolve();
  });
});

module.exports = prepareElectronAsync;
