// Adapted from legacy bash scripts of WebCatalog

const argv = require('yargs-parser')(process.argv.slice(1));

const {
  engine,
  id,
  name,
  url,
  icon,
  homePath,
  desktopPath,
  installationPath,
  createDesktopShortcut,
  requireAdmin,
} = argv;

// const os = require('os');
// const fileType = require('file-type');
const icongen = require('icon-gen');
const Jimp = require('jimp');
const path = require('path');
// const readChunk = require('read-chunk');
// const { execFile } = require('child_process');
const tmp = require('tmp');
const fsExtra = require('fs-extra');
const isUrl = require('is-url');
// const https = require('https');
// const ws = require('windows-shortcuts');
const download = require('download');
const sudo = require('sudo-prompt');

// const getWin32ChromePaths = require('../../get-win32-chrome-paths');
// const getWin32FirefoxPaths = require('../../get-win32-firefox-paths');

const sudoAsync = (prompt) => new Promise((resolve, reject) => {
  const opts = {
    name: 'WebCatalog',
  };
  console.log(prompt);
  process.env.USER = username;
  sudo.exec(prompt, opts, (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      return reject(error);
    }
    console.log(stdout);
    console.log(stderr);
    return resolve(stdout, stderr);
  });
});

const getAppFolderName = () => {
  if (process.platform === 'darwin') {
    return `${name}.app`;
  }
  if (process.platform === 'linux') {
    return `${name}-linux-x64`;
  }
  if (process.platform === 'win32') {
    return `${name}-win32-x64`;
  }
  throw Error('Unsupported platform');
};

const tmpObj = tmp.dirSync();
const tmpPath = tmpObj.name;
const appFolderPath = path.join(tmpPath, getAppFolderName());
const contentsPath = path.join(appFolderPath, 'Contents');
const resourcesPath = process.platform === 'darwin'
  ? path.join(contentsPath, 'Resources')
  : path.join(appFolderPath, 'resources');
const execFilePath = path.join(contentsPath, 'Executable');
const infoPlistPath = path.join(contentsPath, 'Info.plist');
// Mock Electron for backward compatiblity
const appAsarUnpackedPath = path.join(resourcesPath, 'app.asar.unpacked');
const packageJsonPath = path.join(appAsarUnpackedPath, 'package.json');
const appJsonPath = path.join(appAsarUnpackedPath, 'build', 'app.json');
const publicIconIcnsPath = path.join(resourcesPath, 'icon.icns');
const publicIconPngPath = path.join(appAsarUnpackedPath, 'build', 'icon.png');
const publicIconIcoPath = path.join(appAsarUnpackedPath, 'build', 'icon.ico');

const buildResourcesPath = path.join(tmpPath, 'build-resources');
const iconIcnsPath = path.join(buildResourcesPath, 'e.icns');
const iconPngPath = path.join(buildResourcesPath, 'e.png');
const iconIcoPath = path.join(buildResourcesPath, 'e.ico');

console.log(tmpPath);

const chromiumDataPath = path.join(homePath, '.webcatalog', 'chromium-data', id);

const allAppsPath = installationPath.replace('~', homePath);
const finalPath = process.platform === 'darwin'
  ? path.join(allAppsPath, `${name}.app`)
  : path.join(allAppsPath, name);

Promise.resolve()
  .then(() => {
    if (isUrl(icon)) {
      return download(icon, buildResourcesPath, {
        filename: 'e.png',
      });
    }

    return fsExtra.copy(icon, iconPngPath);
  })
  .then(() => Jimp.read(iconPngPath))
  .then((img) => {
    const sizes = process.platform === 'darwin'
      ? [16, 32, 64, 128, 256, 512, 1024]
      : [16, 24, 32, 48, 64, 128, 256];

    const p = (process.platform === 'darwin' || process.platform === 'win32')
      ? sizes.map((size) => new Promise((resolve) => {
        img
          .clone()
          .resize(size, size)
          .quality(100)
          .write(path.join(buildResourcesPath, `${size}.png`), resolve);
      })) : [];

    return Promise.all(p)
      .then(() => {
        if (process.platform === 'darwin') {
          return icongen(buildResourcesPath, buildResourcesPath, {
            report: true,
            icns: {
              name: 'e',
              sizes,
            },
          });
        }
        if (process.platform === 'win32') {
          return icongen(buildResourcesPath, buildResourcesPath, {
            report: true,
            ico: {
              name: 'e',
              sizes,
            },
          })
            .then(() => fsExtra.copy(iconIcoPath, publicIconIcoPath));
        }
        return null;
      });
  })
  .then(() => {
    if (process.platform === 'darwin') {
      return Promise.resolve()
        .then(() => fsExtra.ensureDir(appAsarUnpackedPath))
        .then(() => fsExtra.copy(iconPngPath, publicIconPngPath))
        .then(() => fsExtra.copy(iconIcnsPath, publicIconIcnsPath))
        .then(() => {
          let execFileContent = '';
          switch (engine) {
            case 'firefox': {
              execFileContent = `#!/usr/bin/env bash
/Applications/Firefox.app/Contents/MacOS/Firefox --class ${id} --P ${id} "${url}"`;
              break;
            }
            case 'chromium': {
              execFileContent = `#!/usr/bin/env bash
/Applications/Chromium.app/Contents/MacOS/Chromium --class ${id} --user-data-dir="${chromiumDataPath}" --app="${url}"`;
              break;
            }
            case 'chrome':
            default: {
              execFileContent = `#!/usr/bin/env bash
/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --class ${id} --user-data-dir="${chromiumDataPath}" --app="${url}"`;
            }
          }
          return fsExtra.outputFile(execFilePath, execFileContent);
        })
        .then(() => fsExtra.chmod(execFilePath, '755'))
        .then(() => {
          const infoPlistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>CFBundleExecutable</key>
    <string>Executable</string>
    <key>CFBundleGetInfoString</key>
    <string>${name}</string>
    <key>CFBundleIconFile</key>
    <string>icon.icns</string>
    <key>CFBundleName</key>
    <string>${name}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
  </dict>
</plist>`;
          return fsExtra.outputFile(infoPlistPath, infoPlistContent);
        })
        .then(() => {
          const packageJson = JSON.stringify({
            version: '1.0.0',
          });
          return fsExtra.writeFileSync(packageJsonPath, packageJson);
        })
        .then(() => {
          const appJson = JSON.stringify({
            id, name, url, engine,
          });
          return fsExtra.writeFileSync(appJsonPath, appJson);
        })
        .then(() => {
          if (requireAdmin === 'true') {
            return sudoAsync(`mkdir -p "${allAppsPath}" && rm -rf "${finalPath}" && mv "${appFolderPath}" "${finalPath}"`);
          }
          return fsExtra.move(appFolderPath, finalPath, { overwrite: true });
        });
    }

    return Promise.reject(new Error('Unsupported platform'));
  })
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    /* eslint-disable-next-line */
    console.log(e);
    process.send(e);
    process.exit(1);
  });

process.on('uncaughtException', (e) => {
  /* eslint-disable-next-line */
  console.log(e);
  process.exit(1);
  process.send(e);
});
