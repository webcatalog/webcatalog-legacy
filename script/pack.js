// https://github.com/electron/electron-apps/blob/master/script/pack.js

const fs = require('fs-extra');
const path = require('path');
const yaml = require('yamljs');
const sharp = require('sharp');

const apps = [];
const appPath = path.join(__dirname, '../apps');
const distPath = path.join(__dirname, '../dist');

fs.readdirSync(appPath)
  .filter(filename => fs.statSync(path.join(appPath, filename)).isDirectory())
  .forEach((slug) => {
    const yamlFile = path.join(appPath, `${slug}/${slug}.yml`);
    const app = Object.assign(
      { slug, objectID: slug },
      yaml.load(yamlFile),
      {
        icon: `https://s3.amazonaws.com/webcatalog-apps/${slug}/${slug}-icon.png`,
        icon128: `https://s3.amazonaws.com/webcatalog-apps/${slug}/${slug}-icon-128.png`,
      },
    );

    const iconFile = path.join(appPath, `${slug}/${slug}-icon.png`);
    fs.copySync(iconFile, path.join(distPath, `${slug}/${slug}-icon.png`));

    sharp(iconFile)
      .resize(128, 128)
      .toFile(path.join(distPath, `${slug}/${slug}-icon-128.png`));

    apps.push(app);
  });

fs.ensureDirSync(distPath);

fs.writeFileSync(
  path.join(distPath, 'index.json'),
  JSON.stringify(apps, null, 2),
);
