const fs = require('fs-extra');
const os = require('os');
const packager = require('electron-packager');
const path = require('path');
const tmp = require('tmp');

const moleculePackageJson = require('../package.json');

const createTmpDirAsync = () =>
  new Promise((resolve, reject) => {
    tmp.dir({ unsafeCleanup: true }, (err, dirPath, cleanupCallback) => {
      if (err) {
        return reject(err);
      }

      return resolve({ dirPath, cleanupCallback });
    });
  });

const createAppAsync = (id, name, url, icon, out) => {
  const appDir = path.resolve(__dirname, '..', 'app').replace('app.asar', 'app.asar.unpacked');

  let cleanupCallback;

  return createTmpDirAsync()
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


      let symlinks;
      switch (process.platform) {
        case 'darwin': {
          symlinks = [
            path.join('Contents', 'Resources', 'app.asar'), // 299.1 MB
            path.join('Contents', 'Resources', 'app.asar.unpacked', 'node_modules'), // 25.6 MB
            path.join('Contents', 'Frameworks', 'Electron Framework.framework'), // 118 MB
          ];
          break;
        }
        case 'win32': {
          symlinks = [
            path.join('resources', 'app.asar'), // 251 MB
            path.join('resources', 'app.asar.unpacked', 'node_modules'), // 22.1 MB
            'content_shell.pak', // 11.4 MB
            'node.dll', // 17.7 MB
          ];
          break;
        }
        case 'linux': {
          symlinks = [
            path.join('resources', 'app.asar'), // 172 MB
            path.join('resources', 'app.asar.unpacked', 'node_modules'), // 7.2 MB
            'content_shell.pak', // 12.0 MB
            'libnode.so', // 21.1 MB
            'icudtl.dat', // 10.MB
            'libffmpeg.so', // 3.0 MB
            'snapshot_blob.bin', // 1.4 MB
          ];
          break;
        }
        default:
          symlinks = [];
      }

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
        .then(() => {
          // icon png for BrowserWindow's nativeImage
          if (process.platform === 'linux') {
            return fs.copy(icon, path.join(appAsarUnpackedPath, 'icon.png'));
          }
          return null;
        })
        .then(() => {
          const versionPath = path.join(os.homedir(), '.webcatalog', 'versions', moleculePackageJson.version);

          const p = symlinks.map((l) => {
            const origin = path.join(destPath, l);
            const dest = path.join(versionPath, l);

            return fs.move(origin, dest, { overwrite: true })
              .then(() => fs.ensureSymlink(dest, origin));
          });

          return Promise.all(p);
        })
        .then(() => destPath);
    })
    .catch((err) => {
      cleanupCallback();
      return Promise.reject(err);
    });
};

module.exports = createAppAsync;
