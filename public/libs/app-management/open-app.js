/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fsExtra = require('fs-extra');

const { getPreference } = require('../preferences');

const openApp = (id, name) => {
  if (process.platform === 'darwin') {
    const appPath = path.join(getPreference('installationPath').replace('~', app.getPath('home')), `${name}.app`);
    shell.openPath(appPath);
  } else if (process.platform === 'linux') {
    exec(`gtk-launch webcatalog-${id}`);
  } else if (process.platform === 'win32') {
    const shortcutPath = path.join(getPreference('installationPath'), name, `${name}.lnk`);
    if (fsExtra.existsSync(shortcutPath)) {
      shell.openPath(shortcutPath);
      return;
    }
    const appPath = path.join(getPreference('installationPath'), name, `${name}.exe`);
    shell.openPath(appPath);
  }
};

module.exports = openApp;
