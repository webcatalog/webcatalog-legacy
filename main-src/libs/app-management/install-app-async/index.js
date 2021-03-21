/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable prefer-destructuring */
const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');
const tmp = require('tmp');
const ws = require('windows-shortcuts');
const fsExtra = require('fs-extra');
const { captureException, addBreadcrumb } = require('@sentry/electron');
const envPaths = require('env-paths');

const { getPreferences } = require('../../preferences');
const sendToAllWindows = require('../../send-to-all-windows');
const getFreedesktopCategory = require('../../get-freedesktop-category');

const prepareEngineAsync = require('../prepare-engine-async');
const prepareElectronAsync = require('../prepare-electron-async');
const registryInstaller = require('../registry-installer');

const createShortcutAsync = (shortcutPath, opts) => {
  if (process.platform !== 'win32') {
    return Promise.reject(new Error('Platform is not supported'));
  }

  return new Promise((resolve, reject) => {
    ws.create(shortcutPath, opts, (err) => {
      if (err) { return reject(err); }
      return resolve();
    });
  });
};

const installAppAsync = (
  engine, id, name, url, icon, _opts = {},
) => {
  let v = '0.0.0'; // app version
  let scriptFileName;

  const opts = { ..._opts };
  if (process.platform === 'linux') {
    if (opts.freedesktopMainCategory == null
      || opts.freedesktopAdditionalCategory == null) {
      const val = getFreedesktopCategory(opts.category);
      opts.freedesktopMainCategory = val.freedesktopMainCategory;
      opts.freedesktopAdditionalCategory = val.freedesktopAdditionalCategory;
    }
  }

  const {
    installationPath,
    requireAdmin,
    createDesktopShortcut,
    createStartMenuShortcut,
    registered,
  } = getPreferences();

  const cacheRoot = envPaths('webcatalog', {
    suffix: '',
  }).cache;

  return Promise.resolve()
    .then(() => {
      sendToAllWindows('update-installation-progress', {
        percent: 0,
        desc: null,
      });

      return prepareEngineAsync()
        .then((latestTemplateVersion) => {
          v = latestTemplateVersion;
          scriptFileName = 'install-app-forked-electron-v2.js';
          return prepareElectronAsync();
        });
    })
    .then(() => new Promise((resolve, reject) => {
      const params = [
        '--id',
        id,
        '--name',
        name,
        '--icon',
        icon,
        '--opts',
        JSON.stringify(opts),
        '--homePath',
        app.getPath('home'),
        '--appDataPath',
        app.getPath('appData'),
        '--installationPath',
        installationPath,
        '--requireAdmin',
        requireAdmin.toString(),
        '--username',
        process.env.USER, // required by sudo-prompt,
        '--registered',
        registered,
        '--cacheRoot',
        cacheRoot,
      ];

      if (url != null) {
        params.push('--url');
        params.push(url);
      }

      params.push(
        '--tmpPath',
        tmp.dirSync().name,
      );

      addBreadcrumb({
        category: 'run-forked-script',
        message: 'install-app-async',
        // avoid sending app name, app id to protect user privacy
        data: {
          engine,
          cacheRoot,
          installationPath,
          requireAdmin,
        },
      });

      const scriptPath = path.join(__dirname, scriptFileName)
        .replace('app.asar', 'app.asar.unpacked');
      const child = fork(scriptPath, params, {
        env: {
          ELECTRON_RUN_AS_NODE: 'true',
          ELECTRON_NO_ASAR: 'true',
          APPDATA: app.getPath('appData'),
        },
      });

      let err = null;
      child.on('message', (message) => {
        if (message && message.progress) {
          sendToAllWindows('update-installation-progress', message.progress);
        } else if (message && message.error) {
          err = new Error(message.error.message);
          err.stack = message.error.stack;
          err.name = message.error.name;
        } else {
          console.log(message); // eslint-disable-line no-console
        }
      });

      child.on('exit', (code) => {
        if (code === 1) {
          // force reextracting template code to avoid bugs related to corrupted files
          if (engine === 'electron') {
            global.forceExtract = true;
          }

          reject(err || new Error('Forked script failed to run correctly.'));
          return;
        }

        // installation done
        sendToAllWindows('update-installation-progress', {
          percent: 100,
          desc: null,
        });

        resolve();
      });
    }))
    .then(() => {
      if (process.platform === 'win32') {
        let args;

        if (engine.startsWith('firefox')) {
          if (engine.endsWith('/tabs')) {
            args = `-P "webcatalog-${id}" "${url}"`;
          } else {
            args = `-P "webcatalog-${id}" --ssb="${url}"`;
          }
        } else if (engine !== 'electron') {
          const chromiumDataPath = path.join(app.getPath('home'), '.webcatalog', 'chromium-data', id);
          if (engine.endsWith('/tabs')) {
            args = `--user-data-dir="${chromiumDataPath}" "${url}"`;
          } else {
            args = `--class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}"`;
          }
        }

        const allAppsPath = installationPath.replace('~', app.getPath('home'));
        const finalPath = path.join(allAppsPath, name);
        const finalIconIcoPath = path.join(finalPath, 'resources', 'app.asar.unpacked', 'build', 'icon.ico');
        const exePath = path.join(finalPath, `${name}.exe`);

        const shortcutOpts = {
          target: exePath,
          args,
          icon: finalIconIcoPath,
        };
        const coreShortcutPath = path.join(finalPath, `${name}.lnk`);
        const startMenuPath = path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps');
        const startMenuShortcutPath = path.join(startMenuPath, `${name}.lnk`);
        const desktopShortcutPath = path.join(app.getPath('desktop'), `${name}.lnk`);

        const p = [createShortcutAsync(coreShortcutPath, shortcutOpts)];

        if (createDesktopShortcut) {
          p.push(createShortcutAsync(desktopShortcutPath, shortcutOpts));
        }

        if (createStartMenuShortcut) {
          p.push(fsExtra.ensureDir(startMenuPath)
            .then(() => createShortcutAsync(startMenuShortcutPath, shortcutOpts)));
        }

        if (engine === 'electron') {
          // this step fails randomly on some Windows computers
          // but since this is not very essential
          // so temporarily just collect the bug report and ignore it if the bug occurs
          p.push(
            registryInstaller.installAsync(`webcatalog-${id}`, name, exePath)
              .catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
                captureException(e);
              }),
          );
        }

        return Promise.all(p);
      }

      return null;
    })
    .then(() => ({
      engine,
      id,
      name,
      url,
      icon,
      version: v,
      opts,
    }));
};

module.exports = installAppAsync;
