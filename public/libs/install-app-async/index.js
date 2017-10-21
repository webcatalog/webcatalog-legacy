const { app, shell } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const fs = require('fs-extra');

const getAllAppPath = require('../get-all-app-path');

const destPath = getAllAppPath();

const installAppAsync = appObj =>
  Promise.resolve()
    .then(() =>
      new Promise((resolve, reject) => {
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
          '--destPath',
          destPath,
          '--desktopPath',
          app.getPath('desktop'),
          '--homePath',
          app.getPath('home'),
        ], {
          env: {
            ELECTRON_RUN_AS_NODE: 'true',
            ELECTRON_NO_ASAR: 'true',
          },
        });

        child.on('exit', (code) => {
          if (code === 1) {
            reject(new Error('failed'));
            return;
          }

          // get current molecule version
          fs.readJson(path.join(app.getAppPath(), 'package.json'))
            .then((packageJson) => {
              const finalizedAppObj = Object.assign({}, appObj, {
                moleculeVersion: packageJson.dependencies['@webcatalog/molecule'],
              });
              resolve(finalizedAppObj);
            })
            .catch(reject);
        });
      }))
    .then((finalizedAppObj) => {
      if (process.platform === 'win32') {
        const {
          id, name,
        } = appObj;

        const startMenuShortcutPath = path.join(app.getPath('home'), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps', `${name}.lnk`);
        const desktopShortcutPath = path.join(app.getPath('desktop'), `${name}.lnk`);
        const opts = {
          target: path.join(destPath, id, `${name}.exe`),
          cwd: path.join(destPath, id),
        };

        shell.writeShortcutLink(startMenuShortcutPath, 'create', opts);
        shell.writeShortcutLink(desktopShortcutPath, 'create', opts);
      }

      return finalizedAppObj;
    });

module.exports = installAppAsync;
