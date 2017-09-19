const path = require('path');
const fs = require('fs-extra');
const tmp = require('tmp');
const { https } = require('follow-redirects');
const createAppAsync = require('@webcatalog/molecule');
const argv = require('yargs-parser')(process.argv.slice(1));

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

const getFileNameFromUrl = u => u.substring(u.lastIndexOf('/') + 1);

const createTmpDirAsync = () =>
  new Promise((resolve, reject) => {
    tmp.dir((err, dirPath) => {
      if (err) {
        return reject(err);
      }

      return resolve(dirPath);
    });
  });

const downloadFileTempAsync = fileUrl =>
  createTmpDirAsync()
    .then(tmpPath =>
      new Promise((resolve, reject) => {
        const iconFileName = getFileNameFromUrl(fileUrl);
        const iconPath = path.join(tmpPath, iconFileName);
        const iconFile = fs.createWriteStream(iconPath);

        const req = https.get(fileUrl, (response) => {
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
      }),
    );

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

downloadFileTempAsync(getIconUrl())
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

    if (process.platform === 'linux') {
      const execPath = path.join(destPath, id, name);
      const desktopFilePath = path.join(homePath, '.local', 'share', 'applications', `webcatalog-${id}.desktop`);
      const desktopFileContent = `[Desktop Entry]
Name="${name}"
Exec="${execPath}"
Icon="${path.join(homePath, 'icon.png')}"
Type=Application`;

      return fs.outputFile(desktopFilePath, desktopFileContent);
    }

    return null;
  })
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    process.send(e);
    process.exit(1);
  });

process.on('uncaughtException', (e) => {
  process.exit(1);
  process.send(e);
});
