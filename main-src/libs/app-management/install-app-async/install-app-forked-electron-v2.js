/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
require('source-map-support').install();

// set this event as soon as possible in the process
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

const yargsParser = process.env.NODE_ENV === 'production' ? require('yargs-parser').default : require('yargs-parser');
const packager = require('electron-packager');
const path = require('path');
const fsExtra = require('fs-extra');
const icongen = require('icon-gen');
const Jimp = process.env.NODE_ENV === 'production' ? require('jimp').default : require('jimp');
const isUrl = require('is-url');
const sudo = require('sudo-prompt');

const execAsync = require('../../exec-async');
const downloadAsync = require('../../download-async');
const checkPathInUseAsync = require('../check-path-in-use-async');

// id, name, username might only contain numbers
// causing yargsParser to parse them correctly as Number instead of String
// so it's neccessary to explitcity state their types
const argv = yargsParser(process.argv.slice(1), { string: ['id', 'name', 'username'] });
const {
  cacheRoot,
  homePath,
  icon,
  id,
  installationPath,
  name,
  registered,
  tmpPath,
  url,
  username,
} = argv;
const opts = JSON.parse(argv.opts);

const electronCachePath = path.join(cacheRoot, 'electron');
const webcatalogEngineCachePath = path.join(cacheRoot, 'webcatalog-engine');
const templatePath = path.join(webcatalogEngineCachePath, 'template');

// ignore requireAdmin if installationPath is not custom
const isStandardInstallationPath = installationPath === '~/Applications/WebCatalog Apps'
|| installationPath === '/Applications/WebCatalog Apps';
const requireAdmin = isStandardInstallationPath ? false : argv.requireAdmin;

const buildResourcesPath = path.join(tmpPath, 'build-resources');
const iconIcnsPath = path.join(buildResourcesPath, 'e.icns');
const iconPngPath = path.join(buildResourcesPath, 'e.png');
const iconIcoPath = path.join(buildResourcesPath, 'e.ico');
const appAsarUnpackedPath = path.join(templatePath, 'app.asar.unpacked');
const appJsonPath = path.join(appAsarUnpackedPath, 'build', 'app.json');
const publicIconPngPath = path.join(appAsarUnpackedPath, 'build', 'icon.png');
const publicIconIcoPath = path.join(appAsarUnpackedPath, 'build', 'icon.ico');
const rootPackageJsonPath = path.join(templatePath, 'package.json');
const packageJsonPath = path.join(appAsarUnpackedPath, 'package.json');
const outputPath = path.join(tmpPath, 'dist');
const menubarIconPath = path.join(appAsarUnpackedPath, 'build', 'menubar-icon.png');
const menubarIcon2xPath = path.join(appAsarUnpackedPath, 'build', 'menubar-icon@2x.png');

const getDottemplatePath = () => {
  if (process.platform === 'darwin') {
    return path.join(outputPath, `${name}-darwin-${process.arch}`, `${name}.app`);
  }
  if (process.platform === 'linux') {
    return path.join(outputPath, `${name}-linux-${process.arch}`);
  }
  if (process.platform === 'win32') {
    return path.join(outputPath, `${name}-win32-${process.arch}`);
  }
  throw Error('Unsupported platform');
};

const dotTemplatePath = getDottemplatePath();

const allAppsPath = installationPath.replace('~', homePath);

const finalPath = process.platform === 'darwin'
  ? path.join(allAppsPath, `${name}.app`)
  : path.join(allAppsPath, name);

const sudoAsync = (prompt) => new Promise((resolve, reject) => {
  const sudoOpts = {
    name: 'WebCatalog',
  };
  process.env.USER = username;
  sudo.exec(prompt, sudoOpts, (error, stdout, stderr) => {
    if (error) {
      return reject(error);
    }
    return resolve(stdout, stderr);
  });
});

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
    // eslint-disable-next-line no-console
    console.log('Generating app at', tmpPath);

    process.send({
      progress: {
        percent: 85, // estimated
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
      ? sizes.map((size) => img
        .clone()
        .resize(size, size)
        .quality(100)
        .writeAsync(path.join(buildResourcesPath, `${size}.png`))) : [];

    // menubar icon
    p.push(img
      .clone()
      .resize(20, 20)
      .quality(100)
      .writeAsync(menubarIconPath));
    p.push(img
      .clone()
      .resize(40, 40)
      .quality(100)
      .writeAsync(menubarIcon2xPath));

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
        // dock icon for Linux
        // used in template/public/windows/main.png
        if (process.platform === 'linux') {
          const pp = [1, 2, 3, 4, 5].map((zoom) => img
            .clone()
            .resize(64 * zoom, 64 * zoom)
            .quality(100)
            .writeAsync(path.join(appAsarUnpackedPath, 'build', `dock-icon${zoom > 1 ? `@${zoom}x` : ''}.png`)));
          return Promise.all(pp);
        }
        return null;
      });
  })
  .then(() => fsExtra.copy(iconPngPath, publicIconPngPath))
  .then(() => {
    const appJson = JSON.stringify({
      id,
      name,
      url,
      engine: 'electron',
      registered: registered === 'true',
      opts,
    });
    return fsExtra.writeFile(appJsonPath, appJson);
  })
  // do not use packageJsonPath
  // it does not have devDependencies
  .then(() => fsExtra.readJSON(rootPackageJsonPath))
  .then((packageJson) => {
    const newPackageJson = {
      ...packageJson,
      name,
      main: 'build/electron.js',
    };
    return Promise.all([
      fsExtra.writeJSON(rootPackageJsonPath, newPackageJson),
      fsExtra.writeJSON(packageJsonPath, newPackageJson),
    ]);
  })
  .then(() => {
    process.send({
      progress: {
        percent: 87, // estimated
        desc: 'Installing...',
      },
    });

    let optsIconPath = iconPngPath;
    if (process.platform === 'darwin') optsIconPath = iconIcnsPath;
    if (process.platform === 'win32') optsIconPath = iconIcoPath;

    // max length 43 chars
    // if longer, the app would crash on Mac
    // process memory mac.cc(93)] mach_vm_read(0x7ffeef65c000, 0x2000):
    // (os/kern) invalid address (1)
    const shortIdMap = {
      // 6 apps exist before the bug is discovered
      // we avoid ID changes
      // these cases willl be handled explicitly
      'encyclopaedia-britannica': 's-h19eno6trr',
      'facebook-business-manager': 's-gmqvfslbrg',
      'merriam-webster-dictionary': 's-mle3qne23l',
      'microsoft-outlook-for-microsoft-365': 's-n3317hatzu',
      'microsoft-power-automate': 's-9292ivvzxq',
      'the-church-of-jesus-christ-of-latter-day-saints': 's-eiftr12uvd',
      'us-news-and-world-report': 's-cpv544nw5q',
    };
    const appBundleId = `com.webcatalog.juli.${shortIdMap[id] ? shortIdMap[id] : id}`;

    const packagerOpts = {
      name,
      appBundleId,
      icon: optsIconPath,
      platform: process.platform,
      dir: templatePath,
      out: outputPath,
      overwrite: true,
      prune: true,
      osxSign: false,
      darwinDarkModeSupport: true,
      tmpdir: false,
      prebuiltAsar: path.join(templatePath, 'app.asar'),
      download: {
        cacheRoot: electronCachePath,
      },
    };

    packagerOpts.protocols = [
      {
        name: 'HTTPS Protocol',
        schemes: ['https'],
      },
      {
        name: 'HTTP Protocol',
        schemes: ['http'],
      },
      {
        name: 'Mailto Protocol',
        schemes: ['mailto'],
      },
      {
        name: 'Webcal Protocol',
        schemes: ['webcal'],
      },
    ];

    return packager(packagerOpts)
      // if packager fails, the template might be corrupt
      // so remove it
      .catch((err) => fsExtra.remove(templatePath)
        .then(() => Promise.reject(err)));
  })
  .then(() => {
    // copy app.asar.unpacked
    const resourcesPath = process.platform === 'darwin'
      ? path.join(dotTemplatePath, 'Contents', 'Resources')
      : path.join(dotTemplatePath, 'resources');
    const outputAppAsarUnpackedPath = path.join(resourcesPath, 'app.asar.unpacked');
    return fsExtra.copy(appAsarUnpackedPath, outputAppAsarUnpackedPath, { overwrite: true });
  })
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log('Moved app to', finalPath);
    process.send({
      progress: {
        percent: 90, // estimated
        desc: 'Installing...',
      },
    });

    if (requireAdmin === 'true') {
      return sudoAsync(`mkdir -p "${allAppsPath}" && rm -rf "${finalPath}" && mv "${dotTemplatePath}" "${finalPath}"`);
    }
    // in v20.5.2 and below, '/Applications/WebCatalog Apps' owner is set to `root`
    // need to correct to user to install apps without sudo
    if (installationPath === '/Applications/WebCatalog Apps') {
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
    return fsExtra.move(dotTemplatePath, finalPath, { overwrite: true });
  })
  .then(() => {
    process.send({
      progress: {
        percent: 98, // estimated
        desc: 'Creating shortcuts...',
      },
    });
    // create desktop file for linux
    if (process.platform === 'linux') {
      const execFilePath = path.join(finalPath, name);
      const iconPath = path.join(finalPath, 'resources', 'app.asar.unpacked', 'build', 'icon.png');
      const desktopDirPath = path.join(homePath, '.local', 'share', 'applications');
      const desktopFilePath = path.join(desktopDirPath, `webcatalog-${id}.desktop`);
      // https://askubuntu.com/questions/722179/icon-path-in-desktop-file
      // https://askubuntu.com/questions/189822/how-to-escape-spaces-in-desktop-files-exec-line
      // https://github.com/webcatalog/webcatalog-app/issues/1068

      const categoriesStr = [
        opts.freedesktopMainCategory,
        opts.freedesktopAdditionalCategory,
      ].join(';');

      // Categories must be defined, if not the app won't show up in Mate/Cinnamon application menu
      const desktopFileContent = `[Desktop Entry]
Version=1.0
Type=Application
Name=${name}
GenericName=${name}
Icon=${iconPath}
Exec="${execFilePath}"
Terminal=false
StartupWMClass=${name.toLowerCase()}
Categories=${categoriesStr}
`;
      return fsExtra.ensureDir(desktopDirPath)
        .then(() => fsExtra.writeFile(desktopFilePath, desktopFileContent));
    }

    return null;
  })
  .then(() => {
    process.send({
      progress: {
        percent: 99, // estimated
        desc: 'Cleaning up...',
      },
    });
    // attempt to clean tmp
    return fsExtra.remove(tmpPath)
      // eslint-disable-next-line no-console
      .then(() => console.log('Removed', tmpPath))
      // eslint-disable-next-line no-console
      .catch((err) => console.log('failed to clean tmp:', tmpPath, err));
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
