const argv = require('yargs-parser')(process.argv.slice(1));
const packager = require('electron-packager');
const path = require('path');
const fsExtra = require('fs-extra');
const icongen = require('icon-gen');
const Jimp = require('jimp');
const isUrl = require('is-url');
const sudo = require('sudo-prompt');
const ws = require('windows-shortcuts');
const { exec } = require('child_process');

const downloadAsync = require('../../download-async');

const {
  appPath,
  id,
  name,
  url,
  icon,
  homePath,
  desktopPath,
  installationPath,
  username,
  createDesktopShortcut,
  createStartMenuShortcut,
  tmpPath,
  registered,
} = argv;

// ignore requireAdmin if installationPath is not custom
const isStandardInstallationPath = installationPath === '~/Applications/WebCatalog Apps'
|| installationPath === '/Applications/WebCatalog Apps';
const requireAdmin = isStandardInstallationPath ? false : argv.requireAdmin;

const buildResourcesPath = path.join(tmpPath, 'build-resources');
const iconIcnsPath = path.join(buildResourcesPath, 'e.icns');
const iconPngPath = path.join(buildResourcesPath, 'e.png');
const iconIcoPath = path.join(buildResourcesPath, 'e.ico');
const appJsonPath = path.join(appPath, 'build', 'app.json');
const publicIconPngPath = path.join(appPath, 'build', 'icon.png');
const publicIconIcoPath = path.join(appPath, 'build', 'icon.ico');
const packageJsonPath = path.join(appPath, 'package.json');
const outputPath = path.join(tmpPath, 'dist');

const menubarIconPath = path.join(appPath, 'build', 'menubar-icon.png');
const menubarIcon2xPath = path.join(appPath, 'build', 'menubar-icon@2x.png');

const getDotAppPath = () => {
  if (process.platform === 'darwin') {
    return path.join(outputPath, `${name}-darwin-x64`, `${name}.app`);
  }
  if (process.platform === 'linux') {
    return path.join(outputPath, `${name}-linux-x64`);
  }
  if (process.platform === 'win32') {
    return path.join(outputPath, `${name}-win32-x64`);
  }
  throw Error('Unsupported platform');
};

const dotAppPath = getDotAppPath();

const allAppsPath = installationPath.replace('~', homePath);

const finalPath = process.platform === 'darwin'
  ? path.join(allAppsPath, `${name}.app`)
  : path.join(allAppsPath, name);

const execAsync = (cmd) => new Promise((resolve, reject) => {
  exec(cmd, (e, stdout, stderr) => {
    if (e instanceof Error) {
      reject(e);
      return;
    }

    if (stderr) {
      reject(new Error(stderr));
      return;
    }

    resolve(stdout);
  });
});

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

Promise.resolve()
  .then(() => fsExtra.exists(packageJsonPath))
  .then(() => {
    if (isUrl(icon)) {
      return downloadAsync(icon, iconPngPath);
    }

    // try to get fresh icon from catalog if possible
    if (!id.startsWith('custom-')) {
      const catalogIconUrl = `https://s3.getwebcatalog.com/apps/${id}/${id}-icon.png`;
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

    // menubar icon
    p.push(new Promise((resolve) => {
      img
        .clone()
        .resize(20, 20)
        .quality(100)
        .write(menubarIconPath, resolve);
    }));
    p.push(new Promise((resolve) => {
      img
        .clone()
        .resize(40, 40)
        .quality(100)
        .write(menubarIcon2xPath, resolve);
    }));

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
          const pp = [1, 2, 3, 4, 5].map((zoom) => new Promise((resolve) => {
            img
              .clone()
              .resize(64 * zoom, 64 * zoom)
              .quality(100)
              .write(path.join(appPath, 'build', `dock-icon${zoom > 1 ? `@${zoom}x` : ''}.png`), resolve);
          }));
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
    });
    return fsExtra.writeFileSync(appJsonPath, appJson);
  })
  .then(() => fsExtra.readJSON(packageJsonPath))
  .then((packageJson) => {
    const newPackageJson = Object.assign(packageJson, {
      name,
      main: 'build/electron.js',
      devDependencies: {},
    });
    return fsExtra.writeJSON(packageJsonPath, newPackageJson);
  })
  .then(() => {
    let optsIconPath = iconPngPath;
    if (process.platform === 'darwin') optsIconPath = iconIcnsPath;
    if (process.platform === 'win32') optsIconPath = iconIcoPath;

    const opts = {
      name,
      appBundleId: `com.webcatalog.juli.${id}`,
      icon: optsIconPath,
      platform: process.platform,
      dir: appPath,
      out: outputPath,
      overwrite: true,
      prune: true,
      osxSign: false,
      darwinDarkModeSupport: true,
      tmpdir: false,
      asar: {
        unpack: '{app.json,icon.png,icon.ico,package.json,manifest.json}',
      },
    };

    opts.protocols = [
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
    ];

    return packager(opts)
      // if packager fails, the template might be corrupt
      // so remove it
      .catch((err) => fsExtra.remove(appPath)
        .then(() => Promise.reject(err)));
  })
  .then(async () => {
    if (requireAdmin === 'true') {
      return sudoAsync(`mkdir -p "${allAppsPath}" && rm -rf "${finalPath}" && mv "${dotAppPath}" "${finalPath}"`);
    }
    // in v20.5.2 and below, '/Applications/WebCatalog Apps' owner is set to `root`
    // need to correct to user to install apps without sudo
    if (installationPath === '/Applications/WebCatalog Apps') {
      // https://unix.stackexchange.com/a/7732
      const installationPathOwner = await execAsync("ls -ld '/Applications/WebCatalog Apps' | awk '{print $3}'");
      if (installationPathOwner.trim() === 'root') {
        // https://askubuntu.com/questions/6723/change-folder-permissions-and-ownership
        // https://stackoverflow.com/questions/23714097/sudo-chown-command-not-found
        await sudoAsync(`/usr/sbin/chown -R ${username} '/Applications/WebCatalog Apps'`);
      }
    }
    return fsExtra.move(dotAppPath, finalPath, { overwrite: true });
  })
  .then(() => {
    // create desktop file for linux
    if (process.platform === 'linux') {
      const execFilePath = path.join(finalPath, name);
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
Exec="${execFilePath}"
Terminal=false
`;
      return fsExtra.writeFileSync(desktopFilePath, desktopFileContent);
    }

    if (process.platform === 'win32') {
      const exePath = path.join(finalPath, `${name}.exe`);
      const opts = {
        target: exePath,
        args: '',
        icon: path.join(finalPath, 'resources', 'app.asar.unpacked', 'build', 'icon.ico'),
      };
      const startMenuPath = path.join(homePath, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps');
      const startMenuShortcutPath = path.join(startMenuPath, `${name}.lnk`);
      const desktopShortcutPath = path.join(desktopPath, `${name}.lnk`);

      const p = [];

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
