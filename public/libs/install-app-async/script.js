const { https } = require('follow-redirects');
const argv = require('yargs-parser')(process.argv.slice(1));
const createAppAsync = require('@webcatalog/molecule');
const fs = require('fs-extra');
const path = require('path');
const tmp = require('tmp');

const {
  id,
  name,
  url,
  pngIconUrl,
  icoIconUrl,
  icnsIconUrl,
  destPath,
  homePath,
} = argv;

const iconDirPath = path.join(homePath, '.webcatalog', 'icons');

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

const downloadFilePngAsync = fileUrl =>
  fs.ensureDir(iconDirPath)
    .then(() =>
      new Promise((resolve, reject) => {
        const iconFileName = `${id}.png`;
        const iconPath = path.join(iconDirPath, iconFileName);
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
      }));

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
      }));

const getIconUrl = () => {
  switch (process.platform) {
    case 'darwin': return icnsIconUrl;
    case 'win32': return icoIconUrl;
    default: return pngIconUrl;
  }
};

downloadFilePngAsync(pngIconUrl)
  .then(() => downloadFileTempAsync(getIconUrl()))
  .then(iconPath =>
    createAppAsync(
      id,
      name,
      url,
      iconPath,
      destPath,
    ))
  .then(() => {
    if (process.platform === 'linux') {
      const execPath = path.join(destPath, id, name);
      const desktopFilePath = path.join(homePath, '.local', 'share', 'applications', `webcatalog-${id}.desktop`);
      const desktopFileContent = `[Desktop Entry]
Name="${name}"
Exec="${execPath}"
Icon=${path.join(iconDirPath, `${id}.png`)}
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
