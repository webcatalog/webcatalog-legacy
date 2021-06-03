/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app, BrowserWindow } = require('electron');
const contextMenu = require('electron-context-menu');

const getAuthTokenWithPopupAsync = () => new Promise((resolve, reject) => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      partition: `auth-temp-${Date.now()}`,
      nativeWindowOpen: true,
    },
  });

  contextMenu({ window: win });

  win.webContents.setWindowOpenHandler((details) => {
    if (!details.url) return;
    const urlObj = new URL(details.url);
    if (urlObj.pathname === '/token/in-app/success') {
      const token = urlObj.searchParams.get('token');
      if (token) {
        resolve(token);
        win.close();
      } else {
        reject(new Error('token is not retrieved'));
        win.close();
      }
    }
  });

  // Hide Electron from UA to improve compatibility
  // https://github.com/webcatalog/webcatalog-app/issues/182
  const customUserAgent = win.webContents.getUserAgent()
    // Fix WhatsApp requires Google Chrome 49+ bug
    // App Name doesn't have white space in user agent. 'Google Chat' app > GoogleChat/8.1.1
    .replace(` ${app.name.replace(/ /g, '')}/${app.getVersion()}`, '')
    // Hide Electron from UA to improve compatibility
    // https://github.com/webcatalog/webcatalog-app/issues/182
    .replace(` Electron/${process.versions.electron}`, '');
  win.webContents.setUserAgent(customUserAgent);

  win.loadURL('https://accounts.webcatalog.app/token/in-app');

  win.on('did-fail-load', () => {
    reject(new Error('did-fail-load'));
    win.close();
  });

  win.on('closed', () => {
    reject(new Error('Window is closed'));
  });
});

module.exports = getAuthTokenWithPopupAsync;
