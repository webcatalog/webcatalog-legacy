const { https } = require('follow-redirects');
const argv = require('yargs-parser')(process.argv.slice(1));
const fs = require('fs-extra');
const isUrl = require('is-url');
const path = require('path');

const createAppAsync = require('./create-app-async');

const {
  allAppPath,
  icon,
  id,
  name,
  tempPath,
  url,
} = argv;

const downloadFileTempAsync = (filePath) => {
  const iconFileName = `juli-${id}.png`;
  const iconPath = path.join(tempPath, iconFileName);

  if (isUrl(filePath)) {
    return new Promise((resolve, reject) => {
      const iconFile = fs.createWriteStream(iconPath);

      const req = https.get(filePath, (response) => {
        response.pipe(iconFile);

        iconFile.on('error', (err) => {
          reject(err);
        });

        iconFile.on('finish', () => {
          resolve(iconPath);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });
    });
  }

  return fs.copy(filePath, iconPath)
    .then(() => iconPath);
};

downloadFileTempAsync(icon)
  .then(iconPath =>
    createAppAsync(
      id,
      name,
      url,
      iconPath,
      tempPath,
    )
      .then((appPath) => {
        const originPath = path.join(appPath, `${name}.app`);

        const originPathParsedObj = path.parse(originPath);

        const destPath = path.join(
          allAppPath,
          `${originPathParsedObj.name}${originPathParsedObj.ext}`,
        );

        return fs.move(originPath, destPath)
          .then(() => destPath);
      })
      .then(() => {
        process.exit(0);
      }))
  .catch((e) => {
    process.send(JSON.stringify({
      message: e.message,
      stack: e.stack,
    }));
    process.exit(1);
  });

process.on('uncaughtException', (e) => {
  process.send(JSON.stringify({
    message: e.message,
    stack: e.stack,
  }));
  process.exit(1);
});
