const argv = require('yargs-parser')(process.argv.slice(1));
const packager = require('electron-packager');
const path = require('path');
const fsExtra = require('fs-extra');
const icongen = require('icon-gen');
const Jimp = require('jimp');
const isUrl = require('is-url');
const download = require('download');
const tmp = require('tmp');
const decompress = require('decompress');
const sudo = require('sudo-prompt');

const {
  id,
  name,
  url,
  icon,
  mailtoHandler,
  homePath,
  installationPath,
  requireAdmin,
  username,
} = argv;

const templatePath = path.resolve(__dirname, '..', '..', '..', '..', 'template.zip');

const tmpObj = tmp.dirSync();
const tmpPath = tmpObj.name;
const appPath = path.join(tmpPath, 'template');
const buildResourcesPath = path.join(tmpPath, 'build-resources');
const iconIcnsPath = path.join(buildResourcesPath, 'e.icns');
const iconPngPath = path.join(buildResourcesPath, 'e.png');
const appJsonPath = path.join(appPath, 'build', 'app.json');
const publicIconPngPath = path.join(appPath, 'build', 'icon.png');
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

const sizes = [16, 32, 64, 128, 256, 512, 1024];

const sudoAsync = prompt => new Promise((resolve, reject) => {
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

decompress(templatePath, tmpPath)
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
    const p = sizes.map(size => new Promise((resolve) => {
      img
        .clone()
        .resize(size, size)
        .quality(100)
        .write(path.join(buildResourcesPath, `${size}.png`), resolve);
    }));

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

    return Promise.all(p);
  })
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
    return null;
  })
  .then(() => fsExtra.copy(iconPngPath, publicIconPngPath))
  .then(() => {
    const appJson = JSON.stringify({
      id, name, url, mailtoHandler,
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
    const opts = {
      name,
      appBundleId: `com.webcatalog.juli.${id}`,
      icon: process.platform === 'darwin' ? iconIcnsPath : iconPngPath,
      platform: process.platform,
      dir: appPath,
      out: outputPath,
      overwrite: true,
      prune: true,
      osxSign: false,
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
      const desktopFileContent = `[Desktop Entry]
      Version=1.0
      Type=Application
      Name=${name}
      GenericName=${name}
      Icon=${iconPath}
      Exec=${execFilePath}
      Terminal=false;
      `;
      return fsExtra.writeFileSync(desktopFilePath, desktopFileContent);
    }
    return null;
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
