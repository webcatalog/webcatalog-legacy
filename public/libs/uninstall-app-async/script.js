const os = require('os');
const path = require('path');
const argv = require('yargs-parser')(process.argv.slice(1));
const fs = require('fs-extra');

const {
  allAppPath,
  appId,
  appName,
  desktopPath,
  homePath,
} = argv;

const uninstallAppAsync = () => {
  const p = [];
  switch (os.platform()) {
    case 'darwin': {
      const appPath = path.join(allAppPath, `${appName}.app`);
      p.push(fs.remove(appPath));

      const altAppPath = path.join(homePath, '.webcatalog', `${appName}.app`);
      p.push(fs.remove(altAppPath));
      break;
    }
    case 'linux': {
      const desktopFilePath = path.join(homePath, '.local', 'share', 'applications', `webcatalog-${appId}.desktop`);
      p.push(fs.remove(desktopFilePath));

      const appPath = path.join(allAppPath, appId);
      p.push(fs.remove(appPath));

      break;
    }
    case 'win32':
    default: {
      const appPath = path.join(allAppPath, `${appId}`);
      p.push(fs.remove(appPath));

      const desktopFilePath = path.join(desktopPath, `${appName}.lnk`);
      p.push(fs.remove(desktopFilePath));

      const startMenuShortcutPath = path.join(homePath, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps', `${appName}.lnk`);
      p.push(fs.remove(startMenuShortcutPath));
    }
  }

  const pngIconPath = path.join(homePath, '.webcatalog', 'icons', `${appId}.png`);
  p.push(fs.remove(pngIconPath));

  return Promise.all(p);
};

uninstallAppAsync()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    process.send(e.message);
    process.exit(1);
  });

process.on('uncaughtException', (e) => {
  process.send(e.message);
  process.exit(1);
});
