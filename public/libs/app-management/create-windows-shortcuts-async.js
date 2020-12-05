/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const path = require('path');

const ws = require('windows-shortcuts');

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

const createWindowsShortcutsAsync = ({
  id,
  name,
  url,
  engine,
  homePath,
  allAppsPath,
  browserPath,
}) => {
  let args;

  if (engine.startsWith('firefox')) {
    if (engine.endsWith('/tabs')) {
      args = `-P "webcatalog-${id}" "${url}"`;
    } else {
      args = `-P "webcatalog-${id}" --ssb="${url}"`;
    }
  } else if (engine !== 'electron') {
    const chromiumDataPath = path.join(homePath, '.webcatalog', 'chromium-data', id);
    if (engine.endsWith('/tabs')) {
      args = `--user-data-dir="${chromiumDataPath}" "${url}"`;
    } else {
      args = `--class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}"`;
    }
  }

  const finalPath = path.join(allAppsPath, name);
  const finalIconIcoPath = path.join(finalPath, 'resources', 'app.asar.unpacked', 'build', 'icon.ico');
  const exePath = path.join(finalPath, `${name}.exe`);

  const opts = {
    target: engine === 'electron' ? exePath : browserPath,
    args,
    icon: finalIconIcoPath,
  };
  const coreShortcutPath = path.join(finalPath, `${name}.lnk`);
  const startMenuPath = path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps');
  const startMenuShortcutPath = path.join(startMenuPath, `${name}.lnk`);
  const desktopShortcutPath = path.join(app.getPath('desktop'), `${name}.lnk`);

  const p = [createShortcutAsync(coreShortcutPath, opts)];

  if (createDesktopShortcut) {
    p.push(createShortcutAsync(desktopShortcutPath, opts));
  }

  if (createStartMenuShortcut) {
    p.push(fsExtra.ensureDir(startMenuPath)
      .then(() => createShortcutAsync(startMenuShortcutPath, opts)));
  }
};

module.exports = createWindowsShortcutsAsync;
