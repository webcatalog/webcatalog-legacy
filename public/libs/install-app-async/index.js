const os = require('os');
const fileType = require('file-type');
const icongen = require('icon-gen');
const Jimp = require('jimp');
const path = require('path');
const readChunk = require('read-chunk');
const { execFile } = require('child_process');
const tmp = require('tmp');
const fs = require('fs-extra');
const isUrl = require('is-url');
const https = require('https');

const getInstallationPath = require('../get-installation-path');

const getExpectedIconFileExt = () => {
  switch (process.platform) {
    case 'darwin': return 'icns';
    case 'win32': return 'ico';
    default: return 'png';
  }
};

const createIconAsync = (inputPath, outputDirPath) => {
  let expectedFormat;
  let sizes;

  return Promise.resolve()
    .then(() => {
      const buffer = readChunk.sync(inputPath, 0, 4100);

      const type = fileType(buffer);
      const inputFormat = type.ext;

      expectedFormat = getExpectedIconFileExt();

      if (inputFormat !== 'png') {
        return Promise.reject(new Error('Input format is not supported.'));
      }

      if (expectedFormat === 'png') return Promise.resolve(inputPath);

      sizes = expectedFormat === 'icns'
        ? [16, 24, 32, 48, 64, 128, 256, 512, 1024] // icns
        : [16, 24, 32, 48, 64, 128, 256]; // ico

      return null;
    })
    .then(() => Jimp.read(inputPath))
    .then((img) => {
      const p = sizes.map(size =>
        new Promise((resolve) => {
          img
            .clone()
            .resize(size, size)
            .quality(100)
            .write(path.join(outputDirPath, `${size}.png`), resolve);
        }));

      return Promise.all(p);
    })
    .then(() => icongen(outputDirPath, outputDirPath, { type: 'png', modes: [expectedFormat] }))
    .then(results => results[0]);
};

const downloadFileTempAsync = (filePath, tmpDir) => {
  const iconFileName = `webcatalog-${Date.now()}.png`;
  const iconPath = path.join(tmpDir, iconFileName);

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

const installAppAsync = (appObj, browser) => {
  const {
    id, name, url, icon,
  } = appObj;

  console.log(browser);

  const scriptPath = path.join(__dirname, `appify-${os.platform()}.sh`);

  const tmpDir = tmp.dirSync().name;

  if (process.platform === 'linux') {
    return downloadFileTempAsync(icon, tmpDir)
      .then(pngIcon =>
        new Promise((resolve, reject) => {
          execFile(scriptPath, [
            name,
            url,
            id,
            pngIcon,
            browser,
          ], (err) => {
            if (err) {
              reject(err);
              return;
            }

            resolve();
          });
        }));
  }

  return Promise.resolve()
    .then(() => {
      let pngIcon;
      return downloadFileTempAsync(icon, tmpDir)
        .then((png) => {
          pngIcon = png;
          return createIconAsync(pngIcon, tmp.dirSync().name);
        })
        .then(icnsIcon => ({ icnsIcon, pngIcon }));
    })
    .then(({ icnsIcon, pngIcon }) =>
      new Promise((resolve, reject) => {
        execFile(scriptPath, [
          name,
          url,
          id,
          icnsIcon,
          pngIcon,
          getInstallationPath(),
          browser,
        ], (err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });
      }));
};

module.exports = installAppAsync;
