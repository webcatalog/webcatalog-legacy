const path = require('path');
const createAppAsync = require('@webcatalog/molecule');
const argv = require('yargs-parser')(process.argv.slice(1));

const downloadIconTempAsync = require('./download-icon-temp-async');

const {
  id,
  name,
  url,
  pngIconUrl,
  icoIconUrl,
  icnsIconUrl,
  destPath,
  desktopPath,
  homePath,
} = argv;

const getIconUrl = () => {
  switch (process.platform) {
    case 'darwin': return icnsIconUrl;
    case 'win32': return icoIconUrl;
    default: return pngIconUrl;
  }
};

const createWindowsShortcutAsync = (shortcutPath, options) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line
    const WindowsShortcuts = require('windows-shortcuts');
    WindowsShortcuts.create(shortcutPath, options, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

downloadIconTempAsync(getIconUrl())
  .then(iconPath =>
    createAppAsync(
      id,
      name,
      url,
      iconPath,
      destPath,
    ),
  )
  .then(() => {
    if (process.platform === 'win32') {
      const startMenuShortcutPath = path.join(homePath, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps', `${name}.lnk`);
      const desktopShortcutPath = path.join(desktopPath, `${name}.lnk`);
      const opts = {
        target: path.join(destPath, id, `${name}.exe`),
        desc: path.join(destPath, id, `${name}.exe`),
      };

      return createWindowsShortcutAsync(startMenuShortcutPath, opts)
        .then(() => createWindowsShortcutAsync(desktopShortcutPath, opts));
    }

    return null;
  })
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    process.send(e);
  });

process.on('uncaughtException', (e) => {
  process.send(e);
});
