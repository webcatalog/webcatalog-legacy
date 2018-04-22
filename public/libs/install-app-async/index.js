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
const ws = require('windows-shortcuts');
const { app } = require('electron');

const getInstallationPath = require('../get-installation-path');
const getWin32ChromePaths = require('../get-win32-chrome-paths');

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

const installAppAsync = (appObj, browser) => {
  const {
    id, name, url, category,
  } = appObj;
  const icon = appObj.icon || path.resolve(__dirname, '..', '..', 'default-icon.png');

  const scriptPath = path.join(__dirname, `appify-${os.platform()}.sh`);

  const tmpDir = tmp.dirSync().name;

  if (process.platform === 'win32') {
    const iconDir = path.join(app.getPath('home'), '.webcatalog', 'icons');

    const pngIcon = path.join(iconDir, `${id}.png`);
    const icoIcon = path.join(iconDir, `${id}.ico`);

    return downloadFileTempAsync(icon, tmpDir)
      .then(png =>
        fs.copy(png, pngIcon)
          .then(() => createIconAsync(png, tmpDir)))
      .then(ico => fs.copy(ico, icoIcon))
      .then(() => {
        const desktopShortcutPath = path.join(app.getPath('desktop'), `${name}.lnk`);
        const startMenuPath = getInstallationPath();
        const startMenuShortcutPath = path.join(startMenuPath, `${name}.lnk`);
        const browserPath = browser === 'juli' ?
          path.join(app.getPath('home'), 'AppData', 'Local', 'Programs', 'Juli', 'Juli.exe')
          : getWin32ChromePaths()[0];

        const userDataDir = path.join(app.getPath('home'), '.webcatalog', 'data', id);

        const args = browser === 'juli' ?
          `--id="${id}" --name="${name}" --url="${url}"`
          : `--class "${name}" --user-data-dir="${userDataDir}" --app="${url}"`;

        const opts = {
          target: browserPath,
          args,
          icon: icoIcon,
          desc: JSON.stringify({ id, name, url }),
        };

        return createShortcutAsync(desktopShortcutPath, opts)
          .then(() => fs.ensureDir(startMenuPath))
          .then(() => createShortcutAsync(startMenuShortcutPath, opts));
      });
  }

  if (process.platform === 'linux') {
    return downloadFileTempAsync(icon, tmpDir)
      .then(pngIcon =>
        new Promise((resolve, reject) => {
          execFile(scriptPath, [
            name,
            url,
            id,
            pngIcon,
            category,
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
          return createIconAsync(pngIcon, tmpDir);
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
