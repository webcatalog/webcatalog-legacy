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
  installLocation,
  username,
} = argv;

const templatePath = path.resolve(__dirname, '..', '..', '..', '..', 'template.tar.gz');

const tmpObj = tmp.dirSync();
const tmpPath = tmpObj.name;
const appPath = path.join(tmpPath, 'template');
const buildResourcesPath = path.join(tmpPath, 'build-resources');
const iconIcnsPath = path.join(buildResourcesPath, 'icon.icns');
const iconPngPath = path.join(buildResourcesPath, 'icon.png');
const appJsonPath = path.join(appPath, 'build', 'app.json');
const publicIconPngPath = path.join(appPath, 'build', 'icon.png');
const packageJsonPath = path.join(appPath, 'package.json');
const outputPath = path.join(tmpPath, 'dist');

const menubarIconPath = path.join(appPath, 'build', 'menubar-icon.png');
const menubarIcon2xPath = path.join(appPath, 'build', 'menubar-icon@2x.png');

const dotAppPath = path.join(outputPath, `${name}-darwin-x64`, `${name}.app`);

let allAppsPath = path.join(homePath, 'Applications', 'WebCatalog Apps');
if (installLocation === 'root') {
  allAppsPath = path.join('/', 'Applications', 'WebCatalog Apps');
}

const finalPath = path.join(allAppsPath, `${name}.app`);

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
        filename: 'icon.png',
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
  .then(() => icongen(buildResourcesPath, buildResourcesPath, {
    report: true,
    icns: {
      name: 'icon',
      sizes,
    },
  }))
  .then(results => results[0])
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
      icon: iconIcnsPath,
      platform: 'darwin',
      dir: appPath,
      out: outputPath,
      overwrite: true,
      prune: true,
      osxSign: false,
      asar: {
        unpack: '{app.json,icon.png,package.json,libwidevinecdm.dylib,libwidevinecdm.dylib.sig,manifest.json}',
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
    if (installLocation === 'root') {
      return sudoAsync(`mkdir -p "${allAppsPath}" && rm -rf "${finalPath}" && mv "${dotAppPath}" "${finalPath}"`);
    }

    return fsExtra.move(dotAppPath, finalPath, { overwrite: true });
  })
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    /* eslint-disable-next-line */
    process.send(e);
    process.exit(1);
  });

process.on('uncaughtException', (e) => {
  process.exit(1);
  process.send(e);
});
