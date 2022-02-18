/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app, shell, dialog } = require('electron');
const path = require('path');
const fsExtra = require('fs-extra');

const { getPreference } = require('../preferences');
const mainWindow = require('../windows/main');

const openApp = (id, name) => {
  if (process.platform === 'darwin') {
    const appPath = path.join(getPreference('installationPath').replace('~', app.getPath('home')), `${name}.app`);
    shell.openPath(appPath);
  } else if (process.platform === 'linux') {
    // for unknown reason, we can't launch Linux Electron binary with child_process
    // regardless of launching the binary directly or through gtk-launch
    // exec(`gtk-launch webcatalog-${id}`);
    // so we show user how to open the app manually
    // can open the binary manually
    dialog.showMessageBox(mainWindow.get(), {
      type: 'info',
      message: `Please launch "${name}" manually using system app launcher.`,
      buttons: ['OK'],
      cancelId: 0,
      defaultId: 0,
    }).catch(console.log); // eslint-disable-line
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
