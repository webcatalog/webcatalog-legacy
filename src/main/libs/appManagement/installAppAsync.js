const { app } = require('electron');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const fs = require('fs-extra');

const getAllAppPath = require('./getAllAppPath');
const downloadIconAsync = require('./downloadIconAsync');
const secureFetch = require('./secureFetch');

const installAppAsync = (id, token, opts) =>
  downloadIconAsync(id)
    .then((iconPath) => {
      if (opts && opts.preloadedApp) {
        return Object.assign({}, opts.preloadedApp, { iconPath });
      }

      return secureFetch(`/api/apps/${id}`, token)
        .then(response => response.json())
        .then(content => Object.assign({}, content.app, { iconPath }));
    })
    .then(({ name, url, version, iconPath }) => {
      const appObj = {
        id,
        name,
        url,
        version,
        shellVersion: app.getVersion(),
      };

      const jsonContent = JSON.stringify(appObj); // data to track app info & version

      return new Promise((resolve, reject) => {
        switch (os.platform()) {
          case 'darwin':
          case 'linux': {
            const execFilePath = path.join(app.getAppPath(), 'app', 'scripts', `applify-${os.platform()}.sh`);
            execFile(execFilePath, [
              name,
              url,
              iconPath,
              id,
              jsonContent,
            ], (err) => {
              if (err) {
                reject(err);
                return;
              }

              resolve(appObj);
            });
            break;
          }
          case 'win32':
          default: {
            const iconPersistPath = path.join(app.getPath('userData'), 'icons', `${id}.ico`);

            fs.move(iconPath, iconPersistPath, { overwrite: true }, (moveIconErr) => {
              if (moveIconErr) {
                reject(moveIconErr);
                return;
              }

              /* eslint-disable */
              const WindowsShortcuts = require('windows-shortcuts');
              /* eslint-enable */

              const allAppPath = getAllAppPath();
              const shortcutPath = path.join(allAppPath, `${name}.lnk`);
              WindowsShortcuts.create(shortcutPath, {
                target: '%userprofile%/AppData/Local/Programs/WebCatalog/WebCatalog.exe',
                args: `--name="${name}" --url="${url}" --id="${id}"`,
                icon: iconPersistPath,
                desc: jsonContent,
              }, (err) => {
                if (err) {
                  reject(err);
                  return;
                }

                // create desktop shortcut
                const desktopPath = app.getPath('desktop');
                WindowsShortcuts.create(`${desktopPath}/${name}.lnk`, {
                  target: '%userprofile%/AppData/Local/Programs/WebCatalog/WebCatalog.exe',
                  args: `--name="${name}" --url="${url}" --id="${id}"`,
                  icon: iconPersistPath,
                  desc: jsonContent,
                }, (desktopShortcutErr) => {
                  if (desktopShortcutErr) {
                    reject(desktopShortcutErr);
                    return;
                  }

                  resolve(appObj);
                });
              });
            });
          }
        }
      });
    });

module.exports = installAppAsync;
