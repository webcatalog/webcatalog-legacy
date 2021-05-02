/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const fs = require('fs-extra');
const path = require('path');
const { app, ipcMain } = require('electron');

const mainWindow = require('./windows/main');

const authJsonPath = path.resolve(app.getPath('home'), '.webcatalog', 'auth.json');

let currentContent;

let fsWatcher;

const init = () => {
  // eslint-disable-next-line no-console
  console.log('Watching for', authJsonPath);

  ipcMain.on('request-update-auth-json', (e, authInfo) => {
    if (!authInfo) {
      currentContent = null;
      if (fsWatcher) {
        fsWatcher.close();
        fsWatcher = null;
      }
      fs.writeFileSync(authJsonPath, '');
      return;
    }

    // eslint-disable-next-line no-console
    console.log('Writing auth.json');
    fs.writeJSONSync(authJsonPath, authInfo);
    currentContent = authInfo;

    fsWatcher = fs.watch(authJsonPath, () => {
      // eslint-disable-next-line no-console
      console.log(`${authJsonPath} file changed`);

      // if we detect the file is missing
      // then recreate it
      if (!fs.existsSync(authJsonPath)) {
        if (currentContent) {
          const win = mainWindow.get();
          if (win) {
            win.send('request-auth-token');
          }
        }
        return;
      }

      // if somebody tampers with the file
      // we recreate it
      const fileContent = fs.readFileSync(authJsonPath);
      if (fileContent !== currentContent) {
        const win = mainWindow.get();
        if (win) {
          win.send('request-auth-token');
        }
      }
    });
  });
};

module.exports = {
  init,
};
