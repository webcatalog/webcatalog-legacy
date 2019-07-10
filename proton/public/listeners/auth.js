const {
  BrowserWindow,
  ipcMain,
} = require('electron');

const loadAuthListeners = () => {
  ipcMain.on('request-sign-in-with-google', (e) => {
    let authWindow = new BrowserWindow({
      width: 392,
      height: 520,
      show: false,
      webPreferences: {
        // enable nodeintegration in testing mode (mainly for Spectron)
        nodeIntegration: false,
        sandbox: true,
        partition: `jwt-${Date.now()}`,
      },
    });
    const authUrl = 'https://webcatalog.io/auth/google?jwt=1';
    authWindow.loadURL(authUrl);
    authWindow.show();

    // Handle the response
    authWindow.webContents.on('did-stop-loading', () => {
      if (/^.*(auth\/(google)\/callback\?).*$/.exec(authWindow.webContents.getURL())) {
        const token = authWindow.webContents.getTitle();

        e.sender.send('set-auth-token', token);
        authWindow.destroy();
      }
    });

    // Reset the authWindow on close
    authWindow.on('close', () => {
      authWindow = null;
    }, false);
  });

  ipcMain.on('request-sign-up', (e) => {
    let authWindow = new BrowserWindow({
      width: 392,
      height: 520,
      show: false,
      webPreferences: {
        // enable nodeintegration in testing mode (mainly for Spectron)
        nodeIntegration: false,
        sandbox: true,
        partition: `jwt-${Date.now()}`,
      },
    });
    const authUrl = 'https://webcatalog.io/auth/sign-up?jwt=1';
    authWindow.loadURL(authUrl);
    authWindow.show();

    // Handle the response
    authWindow.webContents.on('did-stop-loading', () => {
      if (/^.*(auth\/(google)\/callback\?).*$/.exec(authWindow.webContents.getURL())) {
        const token = authWindow.webContents.getTitle();

        e.sender.send('set-auth-token', token);
        authWindow.destroy();
      }
    });

    // Reset the authWindow on close
    authWindow.on('close', () => {
      authWindow = null;
    }, false);
  });
};

module.exports = loadAuthListeners;
