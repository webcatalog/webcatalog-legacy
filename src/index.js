const fileType = require('file-type');
const fs = require('fs-extra');
const packager = require('electron-packager');
const path = require('path');
const readChunk = require('read-chunk');
const tmp = require('tmp');
const sharp = require('sharp');
const icongen = require('icon-gen');

const createTmpDirAsync = () =>
  new Promise((resolve, reject) => {
    tmp.dir({ unsafeCleanup: true }, (err, dirPath, cleanupCallback) => {
      if (err) {
        return reject(err);
      }

      return resolve({ dirPath, cleanupCallback });
    });
  });

const getIconFileExt = () => {
  switch (process.platform) {
    case 'darwin': return 'icns';
    case 'win32': return 'ico';
    default: return 'png';
  }
};

const sharpAsync = (inputPath, outputPath, newSize) =>
  new Promise((resolve, reject) => {
    // Generate WebP & PNG
    let p = sharp(inputPath);
    if (newSize) {
      p = p.resize(newSize, newSize);
    }

    p = p.toFile(outputPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(outputPath);
      }
    });

    return p;
  });

const generateIconAsync = (inputPath) => {
  const buffer = readChunk.sync(inputPath, 0, 4100);

  const type = fileType(buffer);
  const inputFormat = type.ext;

  const expectedFormat = getIconFileExt();

  if (inputFormat !== 'png') {
    return Promise.reject(new Error('Input format is not supported.'));
  }

  if (inputFormat === expectedFormat) return Promise.resolve(inputPath);

  return createTmpDirAsync()
    .then((tmpObj) => {
      const { dirPath } = tmpObj;

      const sizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];

      const p = sizes.map(size => sharpAsync(inputPath, path.join(dirPath, `${size}.png`), size));

      return Promise.all(p)
        .then(() => icongen(dirPath, dirPath, { type: 'png', modes: [expectedFormat] }))
        .then(results => results[0]);
    });
};

const createAppAsync = (id, name, url, pngIcon, out) => {
  const appDir = path.resolve(__dirname, '..', 'app').replace('app.asar', 'app.asar.unpacked');

  let cleanupCallback;

  return generateIconAsync(pngIcon)
    .then(icon =>
      createTmpDirAsync()
        .then(tmpObj =>
          new Promise((resolve, reject) => {
            cleanupCallback = tmpObj.cleanupCallback;

            const options = {
              name,
              icon,
              platform: process.platform,
              dir: appDir,
              out: tmpObj.dirPath,
              overwrite: true,
              prune: false,
              asar: {
                unpack: 'package.json',
                unpackDir: path.join('node_modules', 'electron-widevinecdm', 'widevine'),
              },
            };

            return packager(options, (err, appPaths) => {
              if (err) {
                return reject(err);
              }

              return resolve(appPaths);
            });
          }),
        ),
    )
    .then((appPaths) => {
      if (process.platform === 'darwin') {
        const binaryFileName = `${name}.app`;
        const destPath = path.join(out, binaryFileName);

        return fs.move(
          path.join(appPaths[0], binaryFileName),
          destPath,
          { overwrite: true },
        ).then(() => destPath);
      }

      if (process.platform === 'win32' || process.platform === 'linux') {
        const destPath = path.join(out, id);

        return fs.move(
          appPaths[0],
          destPath,
          { overwrite: true },
        ).then(() => destPath);
      }

      return Promise.reject(new Error('Unknown platform'));
    })
    .then((destPath) => {
      cleanupCallback();

      let resourcesPath;
      switch (process.platform) {
        case 'darwin':
          resourcesPath = path.join(destPath, 'Contents', 'Resources');
          break;
        case 'win32':
        case 'linux':
          resourcesPath = path.join(destPath, 'resources');
          break;
        default:
          return Promise.reject(new Error('Unknown platform'));
      }

      const packageJsonPath = path.join(resourcesPath, 'app.asar.unpacked', 'package.json');
      const appAsarUnpackedPath = path.join(resourcesPath, 'app.asar.unpacked');

      return fs.readJson(packageJsonPath)
        .then((packageJsonTemplate) => {
          const packageJson = Object.assign({}, packageJsonTemplate, {
            name: id,
            productName: name,
            webApp: {
              id,
              name,
              url,
            },
          });
          return fs.writeJson(packageJsonPath, packageJson);
        })
        .then(() => fs.copy(pngIcon, path.join(resourcesPath, 'icon.png')))
        .then(() => {
          // icon png for BrowserWindow's nativeImage
          if (process.platform === 'linux') {
            return fs.copy(pngIcon, path.join(appAsarUnpackedPath, 'icon.png'));
          }
          return null;
        })
        .then(() => destPath);
    })
    .catch((err) => {
      cleanupCallback();
      return Promise.reject(err);
    });
};

module.exports = createAppAsync;
