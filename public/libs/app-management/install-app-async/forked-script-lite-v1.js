// Adapted from legacy bash scripts of WebCatalog

const argv = require('yargs-parser')(process.argv.slice(1));
const ws = require('windows-shortcuts');
const icongen = require('icon-gen');
const Jimp = require('jimp');
const path = require('path');
const tmp = require('tmp');
const fsExtra = require('fs-extra');
const isUrl = require('is-url');
const sudo = require('sudo-prompt');

const downloadAsync = require('../../download-async');
const execAsync = require('../../exec-async');
const checkPathInUseAsync = require('../check-path-in-use-async');

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
  createStartMenuShortcut,
  requireAdmin,
  username,
  browserPath,
  registered,
} = argv;

const sudoAsync = (prompt) => new Promise((resolve, reject) => {
  const opts = {
    name: 'WebCatalog',
  };
  process.env.USER = username;
  sudo.exec(prompt, opts, (error, stdout, stderr) => {
    if (error) {
      return reject(error);
    }
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
  .then(() => checkPathInUseAsync(finalPath))
  .then((inUse) => {
    if (inUse) {
      return Promise.reject(new Error('Application is in use.'));
    }
    return null;
  })
  .then(() => {
    process.send({
      progress: {
        percent: 5, // estimated
        desc: 'Generating app...',
      },
    });

    if (isUrl(icon)) {
      return downloadAsync(icon, iconPngPath);
    }

    // try to get fresh icon from catalog if possible
    if (!id.startsWith('custom-')) {
      // use unplated icon on Windows
      const catalogIconUrl = process.platform === 'win32'
        ? `https://storage.atomery.com/webcatalog/catalog/${id}/${id}-icon-unplated.png`
        : `https://storage.atomery.com/webcatalog/catalog/${id}/${id}-icon.png`;
      return downloadAsync(catalogIconUrl, iconPngPath)
        .catch(() => fsExtra.copy(icon, iconPngPath)); // fallback if fails
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
    process.send({
      progress: {
        percent: 40, // estimated
        desc: 'Generating app...',
      },
    });

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
            case 'chromium/tabs': {
              execFileContent = `#!/bin/sh -ue
chromium-browser --user-data-dir="${chromiumDataPath}" "${url}";`;
              break;
            }
            case 'chrome': {
              execFileContent = `#!/bin/sh -ue
google-chrome --class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}";`;
              break;
            }
            case 'chrome/tabs': {
              execFileContent = `#!/bin/sh -ue
google-chrome --user-data-dir="${chromiumDataPath}" "${url}";`;
              break;
            }
            case 'brave': {
              execFileContent = `#!/bin/sh -ue
brave-browser --class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}";`;
              break;
            }
            case 'brave/tabs': {
              execFileContent = `#!/bin/sh -ue
brave-browser --user-data-dir="${chromiumDataPath}" "${url}";`;
              break;
            }
            case 'vivaldi': {
              execFileContent = `#!/bin/sh -ue
vivaldi --class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}";`;
              break;
            }
            case 'vivaldi/tabs': {
              execFileContent = `#!/bin/sh -ue
vivaldi --user-data-dir="${chromiumDataPath}" "${url}";`;
              break;
            }
            case 'opera/tabs': {
              execFileContent = `#!/bin/sh -ue
opera --user-data-dir="${chromiumDataPath}" "${url}";`;
              break;
            }
            case 'yandex': {
              execFileContent = `#!/bin/sh -ue
yandex-browser --class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}";`;
              break;
            }
            case 'yandex/tabs': {
              execFileContent = `#!/bin/sh -ue
yandex-browser --user-data-dir="${chromiumDataPath}" "${url}";`;
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
    return fsExtra.writeFile(packageJsonPath, packageJson);
  })
  .then(() => {
    const appJson = JSON.stringify({
      id,
      name,
      url,
      engine,
      registered: registered === 'true',
    });
    return fsExtra.writeFile(appJsonPath, appJson);
  })
  .then(async () => {
    if (requireAdmin === 'true') {
      return sudoAsync(`mkdir -p "${allAppsPath}" && rm -rf "${finalPath}" && mv "${appFolderPath}" "${finalPath}"`);
    }
    // in v20.5.2 and below, '/Applications/WebCatalog Apps' owner is set to `root`
    // need to correct to user to install apps without sudo
    if (process.platform === 'darwin' && installationPath === '/Applications/WebCatalog Apps') {
      if (!fsExtra.existsSync(installationPath)) {
        fsExtra.mkdirSync(installationPath);
      }
      // https://unix.stackexchange.com/a/7732
      const installationPathOwner = await execAsync("ls -ld '/Applications/WebCatalog Apps' | awk '{print $3}'");
      if (installationPathOwner.trim() === 'root') {
        // https://askubuntu.com/questions/6723/change-folder-permissions-and-ownership
        // https://stackoverflow.com/questions/23714097/sudo-chown-command-not-found
        await sudoAsync(`/usr/sbin/chown -R ${username} '/Applications/WebCatalog Apps'`);
      }
    }
    return fsExtra.move(appFolderPath, finalPath, { overwrite: true });
  })
  .then(() => {
    process.send({
      progress: {
        percent: 95, // estimated
        desc: 'Creating shortcuts...',
      },
    });

    // create desktop file for linux
    if (process.platform === 'linux') {
      const finalExecFilePath = path.join(finalPath, name);
      const iconPath = path.join(finalPath, 'resources', 'app.asar.unpacked', 'build', 'icon.png');
      const desktopDirPath = path.join(homePath, '.local', 'share', 'applications');
      const desktopFilePath = path.join(desktopDirPath, `webcatalog-${id}.desktop`);
      // https://askubuntu.com/questions/722179/icon-path-in-desktop-file
      // https://askubuntu.com/questions/189822/how-to-escape-spaces-in-desktop-files-exec-line
      const desktopFileContent = `[Desktop Entry]
Version=1.0
Type=Application
Name=${name}
GenericName=${name}
Icon=${iconPath}
Exec="${finalExecFilePath}"
Terminal=false
`;
      return fsExtra.ensureDir(desktopDirPath)
        .then(() => fsExtra.writeFile(desktopFilePath, desktopFileContent));
    }

    if (process.platform === 'win32') {
      if (!browserPath) {
        return Promise.reject(new Error('Engine is not supporterd.'));
      }

      const chromiumDataPath = path.join(homePath, '.webcatalog', 'chromium-data', id);
      let args;

      if (engine === 'firefox') {
        args = `--class ${id} --P ${id} "${url}"`;
      } else if (engine.endsWith('/tabs')) {
        args = `--user-data-dir="${chromiumDataPath}" "${url}"`;
      } else {
        args = `--class "${name}" --user-data-dir="${chromiumDataPath}" --app="${url}"`;
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

      if (createDesktopShortcut === 'true') {
        p.push(createShortcutAsync(desktopShortcutPath, opts));
      }

      if (createStartMenuShortcut === 'true') {
        p.push(fsExtra.ensureDir(startMenuPath)
          .then(() => createShortcutAsync(startMenuShortcutPath, opts)));
      }

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
