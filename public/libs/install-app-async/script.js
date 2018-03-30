const { https } = require('follow-redirects');
const argv = require('yargs-parser')(process.argv.slice(1));
const fs = require('fs-extra');
const isUrl = require('is-url');
const path = require('path');
const ws = require('windows-shortcuts');

const createAppAsync = require('./create-app-async');

const {
  allAppPath,
  desktopPath,
  icon,
  id,
  name,
  tempPath,
  url,
  homePath,
  moleculeVersion,
  shareResources,
} = argv;

const downloadFileTempAsync = (filePath) => {
  const iconFileName = `juli-${id}.png`;
  const iconPath = path.join(tempPath, iconFileName);

  if (isUrl(filePath)) {
    return new Promise((resolve, reject) => {
      const iconFile = fs.createWriteStream(iconPath);

      const req = https.get(filePath, (response) => {
        response.pipe(iconFile);

        iconFile.on('error', (err) => {
          reject(err);
        });

        iconFile.on('finish', () => {
          resolve(iconPath);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });
    });
  }

  return fs.copy(filePath, iconPath)
    .then(() => iconPath);
};

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


const moveCommonResourcesAsync = (destPath) => {
  if (shareResources !== 'true') return Promise.resolve();

  const symlinks = process.platform === 'darwin' ? [
    path.join('Contents', 'Frameworks', 'Electron Framework.framework'), // 118 MB
  ] : [];

  const versionPath = path.join(homePath, '.juli', 'versions', moleculeVersion);

  const p = symlinks.map((l) => {
    const origin = path.join(destPath, l);
    const dest = path.join(versionPath, l);

    return fs.pathExists(dest)
      .then((exists) => {
        if (exists) return fs.remove(origin);
        return fs.move(origin, dest, { overwrite: true });
      })
      .then(() => fs.ensureSymlink(dest, origin));
  });

  return Promise.all(p);
};

downloadFileTempAsync(icon)
  .then(iconPath =>
    createAppAsync(
      id,
      name,
      url,
      iconPath,
      tempPath,
    )
      .then((appPath) => {
        const originPath = (process.platform === 'darwin') ?
          path.join(appPath, `${name}.app`) : appPath;

        const originPathParsedObj = path.parse(originPath);

        const destPath = path.join(
          allAppPath,
          process.platform === 'darwin' ? `${originPathParsedObj.name}${originPathParsedObj.ext}` : id,
        );

        return fs.remove(destPath)
          .then(() => fs.move(originPath, destPath))
          .then(() => destPath);
      })
      .then((destPath) => {
        if (process.platform === 'darwin') {
          return moveCommonResourcesAsync(destPath);
        }

        const opts = {
          target: path.join(destPath, `${name}.exe`),
        };

        const desktopShortcutPath = path.join(desktopPath, `${name}.lnk`);
        const startMenuPath = path.join(homePath, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Juli Apps');
        const startMenuShortcutPath = path.join(startMenuPath, `${name}.lnk`);
        return createShortcutAsync(desktopShortcutPath, opts)
          .then(() => fs.ensureDir(startMenuPath))
          .then(() => createShortcutAsync(startMenuShortcutPath, opts));
      })
      .then(() => {
        process.exit(0);
      }))
  .catch((e) => {
    process.send(JSON.stringify({
      message: e.message,
      stack: e.stack,
    }));
    process.exit(1);
  });

process.on('uncaughtException', (e) => {
  process.send(JSON.stringify({
    message: e.message,
    stack: e.stack,
  }));
  process.exit(1);
});
