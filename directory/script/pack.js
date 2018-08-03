// https://github.com/electron/electron-apps/blob/master/script/pack.js
const { exec } = require('child_process');
const fs = require('fs-extra');
const imageSize = require('image-size');
const path = require('path');
const Queue = require('promise-queue');
const sharp = require('sharp');
const yaml = require('yamljs');

const apps = [];
const appPath = path.join(__dirname, '../apps');
const distPath = path.join(__dirname, '../dist');
const fixIconPyPath = path.join(__dirname, 'fixicon.py');

const fixIconAsync = iconPath =>
  new Promise((resolve, reject) => {
    const size = imageSize(iconPath).width;
    const pad = Math.round((size / 512) * 20); // need to find a better formula

    exec(`python3 ${fixIconPyPath} ${iconPath} ${size} ${pad}`, (e, stdout, stderr) => {
      if (e instanceof Error) {
        reject(e);
        return;
      }

      resolve({ stdout, stderr });
    });
  });

// Run concurrently to improve performance
const maxConcurrent = 20;
const maxQueue = Infinity;
const queue = new Queue(maxConcurrent, maxQueue);

fs.readdirSync(appPath)
  .filter(filename => fs.statSync(path.join(appPath, filename)).isDirectory())
  .forEach((slug) => {
    const yamlFile = path.join(appPath, `${slug}/${slug}.yml`);
    const app = Object.assign(
      { id: slug, objectID: slug },
      yaml.load(yamlFile),
      {
        icon: `https://raw.githubusercontent.com/quanglam2807/webcatalog/icons/${slug}/${slug}-icon.png`,
        icon128: `https://cdn.rawgit.com/quanglam2807/webcatalog/icons/${slug}/${slug}-icon-128.png`,
      },
    );

    const iconFile = path.join(appPath, `${slug}/${slug}-icon.png`);
    const copiedIconFile = path.join(distPath, `${slug}/${slug}-icon.png`);

    fs.copySync(iconFile, copiedIconFile);

    queue.add(() => {
      // eslint-disable-next-line
      console.log('queue length: ', queue.getQueueLength());

      return fixIconAsync(copiedIconFile)
        .then(() =>
          sharp(iconFile)
            .resize(128, 128)
            .toFile(path.join(distPath, `${slug}/${slug}-icon-128.png`)))
        .catch((e) => {
          // eslint-disable-next-line
          console.log(e);
          process.exit(1);
        });
    });

    apps.push(app);
  });

fs.ensureDirSync(distPath);

fs.writeFileSync(
  path.join(distPath, 'index.json'),
  JSON.stringify(apps, null, 2),
);
