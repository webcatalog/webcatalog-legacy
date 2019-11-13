const argv = require('yargs-parser')(process.argv.slice(1));
const packager = require('electron-packager');
const path = require('path');
const fsExtra = require('fs-extra');
const icongen = require('icon-gen');
const Jimp = require('jimp');
const isUrl = require('is-url');
const download = require('download');
const decompress = require('decompress');
const sudo = require('sudo-prompt');
const ws = require('windows-shortcuts');

const {
  id,
  name,
  url,
  icon,
  mailtoHandler,
  homePath,
  desktopPath,
  installationPath,
  requireAdmin,
  username,
  createDesktopShortcut,
  createStartMenuShortcut,
  tmpPath,
} = argv;

const templatePath = path.resolve(__dirname, '..', '..', '..', '..', 'template.zip');

const appPath = path.join(tmpPath, 'template');
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
  .then((exists) => {
    // if tmp path has package.json file
    // assume that it has the template code
    if (exists) return null;
    // if not, decompress new template code
    return decompress(templatePath, tmpPath);
  })
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

    // menubar icon
    if (process.platform === 'darwin') {
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
    }

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
  .then(() => fsExtra.copy(iconPngPath, publicIconPngPath))
  .then(() => {
    const appJson = JSON.stringify({
      id, name, url, mailtoHandler, engine: 'electron',
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
      asar: {
        unpack: '{app.json,icon.png,package.json,manifest.json}',
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
    ];

    if (mailtoHandler && mailtoHandler.length > 0) {
      opts.protocols.push({
        name: 'Mailto Protocol',
        schemes: ['mailto'],
      });
    }

    return packager(opts);
  })
  .then(() => {
    if (requireAdmin === 'true') {
      return sudoAsync(`mkdir -p "${allAppsPath}" && rm -rf "${finalPath}" && mv "${dotAppPath}" "${finalPath}"`);
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
Terminal=false;
`;
      return fsExtra.writeFileSync(desktopFilePath, desktopFileContent);
    }

    if (process.platform === 'win32') {
      const exePath = path.join(finalPath, `${name}.exe`);
      const opts = {
        target: exePath,
        args: '',
        icon: publicIconIcoPath,
      };
      const startMenuPath = path.join(homePath, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps');
      const startMenuShortcutPath = path.join(startMenuPath, `${name}.lnk`);
      const desktopShortcutPath = path.join(desktopPath, `${name}.lnk`);

      const p = [];

      if (createDesktopShortcut) {
        p.push(createShortcutAsync(desktopShortcutPath, opts));
      }

      if (createStartMenuShortcut) {
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
