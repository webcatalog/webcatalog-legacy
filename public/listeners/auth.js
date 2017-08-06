const fs = require('fs-extra');
const path = require('path');
const rp = require('request-promise');
const {
  app,
  BrowserWindow,
  ipcMain,
} = require('electron');

const configPath = path.resolve(app.getPath('home'), '.webcatalogrc');

const writeTokenToDiskAsync = token => fs.writeJson(configPath, { token });

const loadAuthListeners = () => {
  ipcMain.on('log-out', (e) => {
    fs.remove(configPath)
      .then(() => {
        e.sender.send('set-auth-token', null);
      })
      // eslint-disable-next-line
      .catch(console.log);
  });

  ipcMain.on('read-token-from-disk', (e) => {
    // Try to load token
    fs.readJson(configPath)
      .then((token) => {
        e.sender.send('set-auth-token', token);
      })
      // eslint-disable-next-line
      .catch(() => {
        e.sender.send('set-auth-token', null);
      });
  });

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
        const token = parsedResponse.jwt;

        writeTokenToDiskAsync(token)
          .catch((err) => {
            // eslint-disable-next-line
            console.log(err);
          });

        e.sender.send('set-auth-token', token);
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
        const token = authWindow.webContents.getTitle();

        writeTokenToDiskAsync(token)
          .catch((err) => {
            // eslint-disable-next-line
            console.log(err);
          });

        e.sender.send('set-auth-token', token);
        authWindow.destroy();
      }
    });

    // Reset the authWindow on close
    authWindow.on('close', () => {
      authWindow = null;
    }, false);
  });

  ipcMain.on('sign-in-anonymously', (e) => {
    const token = 'anonymous';

    writeTokenToDiskAsync(token)
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err);
      });
    e.sender.send('set-auth-token', token);
  });
};

module.exports = loadAuthListeners;
