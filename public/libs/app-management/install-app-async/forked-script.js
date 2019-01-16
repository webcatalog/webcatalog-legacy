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

const {
  id,
  name,
  url,
  icon,
  mailtoHandler,
  homePath,
} = argv;

const templatePath = path.resolve(__dirname, '..', '..', '..', '..', 'template.tar.gz');

const tmpObj = tmp.dirSync();
const tmpPath = tmpObj.name;
const appPath = path.join(tmpPath, 'template');
const buildResourcesPath = path.join(tmpPath, 'build-resources');
const iconIcnsPath = path.join(buildResourcesPath, 'icon.icns');
const iconPngPath = path.join(buildResourcesPath, 'icon.png');
const appJsonPath = path.join(appPath, 'public', 'app.json');
const publicIconPngPath = path.join(appPath, 'public', 'icon.png');
const packageJsonPath = path.join(appPath, 'package.json');
const outputPath = path.join(tmpPath, 'dist');

const dotAppPath = path.join(outputPath, `${name}-darwin-x64`, `${name}.app`);
const finalPath = path.join(homePath, 'Applications', 'WebCatalog Apps', `${name}.app`);

const sizes = [16, 32, 64, 128, 256, 512, 1024];

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
      asar: {
        unpack: '{app.json,icon.png,package.json}',
      },
    };

    if (mailtoHandler && mailtoHandler.length > 0) {
      opts.protocols = [
        {
          name: 'Mailto Protocol',
          schemes: ['mailto'],
        },
      ];
    }

    return packager(opts);
  })
  .then(() => fsExtra.move(dotAppPath, finalPath, { overwrite: true }))
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
  process.exit(1);
  process.send(e);
});
