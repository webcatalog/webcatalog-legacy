// Adapted from legacy bash scripts of WebCatalog

const argv = require('yargs-parser')(process.argv.slice(1));
const ws = require('windows-shortcuts');
const icongen = require('icon-gen');
const Jimp = require('jimp');
const path = require('path');
const tmp = require('tmp');
const fsExtra = require('fs-extra');
const isUrl = require('is-url');
const download = require('download');
const sudo = require('sudo-prompt');

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
  username,
  firefoxPath,
  chromePath,
  bravePath,
} = argv;

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


const tmpObj = tmp.dirSync();
const tmpPath = tmpObj.name;
const appFolderPath = path.join(tmpPath, getAppFolderName());
// Mock Electron for backward compatiblity
const contentsPath = path.join(appFolderPath, 'Contents');
const resourcesPath = process.platform === 'darwin'
  ? path.join(contentsPath, 'Resources')
  : path.join(appFolderPath, 'resources');
const infoPlistPath = path.join(contentsPath, 'Info.plist');
const execFilePath = process.platform === 'darwin'
  ? path.join(contentsPath, 'Executable')
  : path.join(appFolderPath, name);
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

const allAppsPath = installationPath.replace('~', homePath);
const finalPath = process.platform === 'darwin'
  ? path.join(allAppsPath, `${name}.app`)
  : path.join(allAppsPath, name);

const finalIconIcoPath = path.join(finalPath, 'resources', 'app.asar.unpacked', 'build', 'icon.ico');

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
          const chromiumDataPath = path.join('$HOME', '.webcatalog', 'chromium-data', id);
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
            case 'chrome': {
              execFileContent = `#!/usr/bin/env bash
/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --class ${id} --user-data-dir="${chromiumDataPath}" --app="${url}"`;
              break;
            }
            case 'brave': {
              execFileContent = `#!/usr/bin/env bash
/Applications/Brave\\ Browser.app/Contents/MacOS/Brave\\ Browser --class ${id} --user-data-dir="${chromiumDataPath}" --app="${url}"`;
              break;
            }
            default: {
              return Promise.reject(new Error('Engine is not supported'));
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
        });
    }

    if (process.platform === 'linux') {
      return Promise.resolve()
        .then(() => fsExtra.ensureDir(appAsarUnpackedPath))
        .then(() => fsExtra.copy(iconPngPath, publicIconPngPath))
        .then(() => {
          const chromiumDataPath = path.join('$HOME', '.webcatalog', 'chromium-data', id);
          let execFileContent = '';
          switch (engine) {
            case 'firefox': {
              execFileContent = `#!/bin/sh -ue
firefox --class ${id} --P ${id} "${url}";`;
              break;
            }
            case 'chromium': {
              execFileContent = `#!/bin/sh -ue
chromium-browser --class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}";`;
              break;
            }
            case 'chrome': {
              execFileContent = `#!/bin/sh -ue
google-chrome --class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}";`;
              break;
            }
            case 'brave': {
              execFileContent = `#!/bin/sh -ue
brave-browser --class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}";`;
              break;
            }
            default: {
              return Promise.reject(new Error('Engine is not supported'));
            }
          }
          return fsExtra.outputFile(execFilePath, execFileContent);
        })
        .then(() => fsExtra.chmod(execFilePath, '755'));
    }

    if (process.platform === 'win32') {
      return Promise.resolve()
        .then(() => fsExtra.ensureDir(appAsarUnpackedPath))
        .then(() => fsExtra.copy(iconPngPath, publicIconPngPath))
        .then(() => fsExtra.copy(iconIcoPath, publicIconIcoPath));
    }

    return Promise.reject(new Error('Unsupported platform'));
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
  })
  .then(() => {
    // create desktop file for linux
    if (process.platform === 'linux') {
      const finalExecFilePath = path.join(finalPath, name);
      const iconPath = path.join(finalPath, 'resources', 'app.asar.unpacked', 'build', 'icon.png');
      const desktopFilePath = path.join(homePath, '.local', 'share', 'applications', `webcatalog-${id}.desktop`);
      // https://askubuntu.com/questions/722179/icon-path-in-desktop-file
      // https://askubuntu.com/questions/189822/how-to-escape-spaces-in-desktop-files-exec-line
      const desktopFileContent = `[Desktop Entry]
Version=1.0
Type=Application
Name=${name}
GenericName=${name}
Icon=${iconPath}
Exec="${finalExecFilePath}"
Terminal=false;
`;
      return fsExtra.writeFileSync(desktopFilePath, desktopFileContent);
    }

    if (process.platform === 'win32') {
      const chromiumDataPath = path.join(homePath, '.webcatalog', 'chromium-data', id);
      let browserPath;
      let args;

      if (engine === 'firefox') {
        browserPath = firefoxPath;
        args = `--class ${id} --P ${id} "${url}"`;
      } else if (engine === 'chrome') {
        browserPath = chromePath;
        args = `--class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}"`;
      } else if (engine === 'brave') {
        browserPath = bravePath;
        args = `--class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}"`;
      } else {
        return Promise.reject(new Error('Engine is not supporterd.'));
      }

      const opts = {
        target: browserPath,
        args,
        icon: finalIconIcoPath,
      };
      const coreShortcutPath = path.join(finalPath, `${name}.lnk`);
      const startMenuPath = path.join(homePath, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps');
      const startMenuShortcutPath = path.join(startMenuPath, `${name}.lnk`);
      const desktopShortcutPath = path.join(desktopPath, `${name}.lnk`);

      const p = [createShortcutAsync(coreShortcutPath, opts)];

      if (createDesktopShortcut) {
        p.push(createShortcutAsync(desktopShortcutPath, opts));
      }

      p.push(fsExtra.ensureDir(startMenuPath)
        .then(() => createShortcutAsync(startMenuShortcutPath, opts)));

      return Promise.all(p);
    }
    return null;
  })
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    process.send({
      error: {
        name: e.name,
        message: e.message,
        stack: e.stack,
      },
    });
    process.exit(1);
  });

process.on('uncaughtException', (e) => {
  process.send({
    error: {
      name: e.name,
      message: e.message,
      stack: e.stack,
    },
  });
  process.exit(1);
});
