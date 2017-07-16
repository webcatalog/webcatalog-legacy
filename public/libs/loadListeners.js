const {
  BrowserWindow,
  ipcMain,
  shell,
} = require('electron');
const rp = require('request-promise');

const loadListeners = () => {
  ipcMain.on('sign-in-with-password', (e, email, password) => {
    const options = {
      method: 'POST',
      uri: 'https://getwebcatalog.com/api/auth',
      body: {
        email,
        password,
      },
      json: true,
    };

    rp(options)
      .then((parsedResponse) => {
        const { jwt } = parsedResponse;
        e.sender.send('set-auth-token', jwt);
      })
      .catch((err) => {
        const code = err.error && err.error.error && err.error.error.code ? err.error.error.code : 'no_connection';

        let message = 'WebCatalog is having trouble connecting to our server.';
        if (code === 'wrong_password') {
          message = 'The password you entered is incorrect.';
        }

        e.sender.send('open-snackbar', message);
      });
  });

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

  ipcMain.on('open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });
};

module.exports = loadListeners;
