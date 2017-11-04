const { app, shell } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const fs = require('fs-extra');

const getAllAppPath = require('../get-all-app-path');

const allAppPath = getAllAppPath();

const installAppAsync = appObj =>
  fs.readJson(path.join(app.getAppPath(), 'package.json'))
    .then((moleculePackageJson) => {
      const moleculeVersion = moleculePackageJson.dependencies['@webcatalog/molecule'];

      return new Promise((resolve, reject) => {
        const {
          id, name, url, icnsIconUrl, icoIconUrl, pngIconUrl,
        } = appObj;

        const scriptPath = path.join(__dirname, 'script.js').replace('app.asar', 'app.asar.unpacked');

        const child = fork(scriptPath, [
          '--id',
          id,
          '--name',
          name,
          '--url',
          url,
          '--icnsIconUrl',
          icnsIconUrl,
          '--icoIconUrl',
          icoIconUrl,
          '--pngIconUrl',
          pngIconUrl,
          '--allAppPath',
          getAllAppPath(),
          '--desktopPath',
          app.getPath('desktop'),
          '--homePath',
          app.getPath('home'),
          '--moleculeVersion',
          moleculeVersion,
        ], {
          env: {
            ELECTRON_RUN_AS_NODE: 'true',
            ELECTRON_NO_ASAR: 'true',
          },
        });

        child.on('message', (message) => {
          reject(new Error(message));
        });

        child.on('exit', (code) => {
          if (code === 0) {
            resolve();
            return;
          }

          reject(new Error('Forked script error'));
        });
      })
        .then(() => {
          if (process.platform === 'win32') {
            const {
              id, name,
            } = appObj;

            const startMenuShortcutPath = path.join(app.getPath('home'), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps', `${name}.lnk`);
            const desktopShortcutPath = path.join(app.getPath('desktop'), `${name}.lnk`);
            const opts = {
              target: path.join(allAppPath, id, `${name}.exe`),
              cwd: path.join(allAppPath, id),
            };

            shell.writeShortcutLink(startMenuShortcutPath, 'create', opts);
            shell.writeShortcutLink(desktopShortcutPath, 'create', opts);
          }

          const finalizedAppObj = Object.assign({}, appObj, {
            moleculeVersion,
          });

          return finalizedAppObj;
        });
    });

module.exports = installAppAsync;
