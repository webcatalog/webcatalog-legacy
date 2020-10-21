// Adapted from legacy bash scripts of WebCatalog
require('source-map-support').install();

const yargsParser = process.env.NODE_ENV === 'production' ? require('yargs-parser').default : require('yargs-parser');
const icongen = require('icon-gen');
const Jimp = process.env.NODE_ENV === 'production' ? require('jimp').default : require('jimp');
const path = require('path');
const tmp = require('tmp');
const fsExtra = require('fs-extra');
const isUrl = require('is-url');
const sudo = require('sudo-prompt');

const downloadAsync = require('../../download-async');
const execAsync = require('../../exec-async');
const checkPathInUseAsync = require('../check-path-in-use-async');

const argv = yargsParser(process.argv.slice(1));
const {
  engine,
  id,
  name,
  url,
  icon,
  homePath,
  installationPath,
  requireAdmin,
  username,
  registered,
  browserPath,
  appDataPath,
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

const tmpObj = tmp.dirSync();
const tmpPath = tmpObj.name;
const appFolderPath = path.join(tmpPath, getAppFolderName());
// Mock Electron for backward compatiblity
const contentsPath = path.join(appFolderPath, 'Contents');
const resourcesPath = process.platform === 'darwin'
  ? path.join(contentsPath, 'Resources')
  : path.join(appFolderPath, 'resources');
const execFilePath = process.platform === 'darwin'
  ? path.join(contentsPath, 'Executable')
  : path.join(appFolderPath, name);
const appAsarUnpackedPath = path.join(resourcesPath, 'app.asar.unpacked');
const packageJsonPath = path.join(appAsarUnpackedPath, 'package.json');
const appJsonPath = path.join(appAsarUnpackedPath, 'build', 'app.json');
const publicIconPngPath = path.join(appAsarUnpackedPath, 'build', 'icon.png');
const publicIconIcoPath = path.join(appAsarUnpackedPath, 'build', 'icon.ico');

const buildResourcesPath = path.join(tmpPath, 'build-resources');
const iconPngPath = path.join(buildResourcesPath, 'e.png');
const iconIcoPath = path.join(buildResourcesPath, 'e.ico');

const allAppsPath = installationPath.replace('~', homePath);
const finalPath = process.platform === 'darwin'
  ? path.join(allAppsPath, `${name}.app`)
  : path.join(allAppsPath, name);

const firefoxProfileId = `webcatalog-${id}`;

Promise.resolve()
  .then(() => {
    if (process.platform === 'win32') {
      return checkPathInUseAsync(finalPath);
    }
    // skip this check on Mac & Linux
    // as on Unix, it's possible to replace files even when running
    // https://askubuntu.com/questions/44339/how-does-updating-running-application-binaries-during-an-upgrade-work
    return false;
  })
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
        desc: 'Installing...',
      },
    });

    if (isUrl(icon)) {
      return downloadAsync(icon, iconPngPath);
    }

    // try to get fresh icon from catalog if possible
    if (!id.startsWith('custom-')) {
      // use unplated icon on Windows
      const catalogIconUrl = process.platform === 'win32'
        ? `https://storage.webcatalog.app/catalog/${id}/${id}-icon-unplated.png`
        : `https://storage.webcatalog.app/catalog/${id}/${id}-icon.png`;
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
        desc: 'Installing...',
      },
    });

    if (process.platform === 'darwin') {
      return Promise.reject(new Error('Platform is not supported'));
    }

    if (process.platform === 'linux') {
      return Promise.resolve()
        .then(() => fsExtra.ensureDir(appAsarUnpackedPath))
        .then(() => fsExtra.copy(iconPngPath, publicIconPngPath))
        .then(() => {
          const chromiumDataPath = path.join('$HOME', '.webcatalog', 'chromium-data', id);
          let execFileContent = '';
          switch (engine) {
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
            case 'firefox': {
              execFileContent = `#!/bin/sh -ue
firefox -new-instance -P "webcatalog-${id}" --ssb="${url}";`;
              break;
            }
            case 'firefox/tabs': {
              execFileContent = `#!/bin/sh -ue
firefox -new-instance -P "webcatalog-${id}" "${url}";`;
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
          // create firefox profile
          if (engine.startsWith('firefox')) {
            return Promise.resolve()
              .then(() => execAsync(`DISPLAY=:0.0 firefox -CreateProfile "${firefoxProfileId}"`))
              // enable flag for ssb (site-specific-browser) (Firefox experimental feature)
              .then(() => {
                const profilesPath = path.join(homePath, '.mozilla', 'firefox');
                const profileFullId = fsExtra.readdirSync(profilesPath)
                  .find((itemName) => itemName.endsWith(firefoxProfileId));
                const profilePath = path.join(profilesPath, profileFullId);
                // https://developer.mozilla.org/en-US/docs/Mozilla/Preferences/A_brief_guide_to_Mozilla_preferences
                // http://kb.mozillazine.org/User.js_file
                const userJsPath = path.join(profilePath, 'user.js');
                return fsExtra.writeFile(userJsPath, 'user_pref("browser.ssb.enabled", true);');
              });
          }
          return null;
        });
    }

    if (process.platform === 'win32') {
      return Promise.resolve()
        .then(() => {
          if (engine.startsWith('firefox')) {
            // create firefox profile
            return Promise.resolve()
              .then(() => execAsync(`"${browserPath}" -CreateProfile "${firefoxProfileId}"`))
              // enable flag for ssb (site-specific-browser) (Firefox experimental feature)
              .then(() => {
                const profilesPath = path.join(appDataPath, 'Mozilla', 'Firefox', 'Profiles');
                const profileFullId = fsExtra.readdirSync(profilesPath)
                  .find((itemName) => itemName.endsWith(firefoxProfileId));
                const profilePath = path.join(profilesPath, profileFullId);
                // https://developer.mozilla.org/en-US/docs/Mozilla/Preferences/A_brief_guide_to_Mozilla_preferences
                // http://kb.mozillazine.org/User.js_file
                const userJsPath = path.join(profilePath, 'user.js');
                return fsExtra.writeFile(userJsPath, 'user_pref("browser.ssb.enabled", true);');
              });
          }
          return null;
        })
        .then(() => fsExtra.ensureDir(appAsarUnpackedPath))
        .then(() => fsExtra.copy(iconPngPath, publicIconPngPath))
        .then(() => fsExtra.copy(iconIcoPath, publicIconIcoPath));
    }

    return Promise.reject(new Error('Unsupported platform'));
  })
  .then(() => {
    const packageJson = JSON.stringify({
      version: '1.1.0',
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
Icon=${iconPath}c
Exec="${finalExecFilePath}"
Terminal=false
StartupWMClass=${name.toLowerCase()}
`;
      return fsExtra.ensureDir(desktopDirPath)
        .then(() => fsExtra.writeFile(desktopFilePath, desktopFileContent));
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
