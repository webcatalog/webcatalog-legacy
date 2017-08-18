const fs = require('fs-extra');
const path = require('path');
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
      .then(({ token }) => {
        e.sender.send('set-auth-token', token);
      })
      // eslint-disable-next-line
      .catch(() => {
        e.sender.send('set-auth-token', null);
      });
  });

  ipcMain.on('write-token-to-disk', (e, token) => {
    writeTokenToDiskAsync(token)
      .then(() => {
        e.sender.send('set-auth-token', token);
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err);
      });

    e.sender.send('set-auth-token', token);
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
    const authUrl = 'https://webcatalog.io/auth/google?jwt=1';
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

  ipcMain.on('sign-up', (e) => {
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
};

module.exports = loadAuthListeners;
