const { ipcMain, BrowserWindow } = require('electron');

const loadListeners = () => {
  ipcMain.on('sign-in-with-google', (e) => {
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
    const authUrl = 'https://getwebcatalog.com/auth/google?jwt=1';
    authWindow.loadURL(authUrl);
    authWindow.show();

    // Handle the response
    authWindow.webContents.on('did-stop-loading', () => {
      if (/^.*(auth\/(google)\/callback\?).*$/.exec(authWindow.webContents.getURL())) {
        e.sender.send('set-auth-token', authWindow.webContents.getTitle());
        authWindow.destroy();
      }
    });

    // Reset the authWindow on close
    authWindow.on('close', () => {
      authWindow = null;
    }, false);
  });
};

module.exports = loadListeners;
