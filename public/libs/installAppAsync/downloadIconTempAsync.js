const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const { https } = require('follow-redirects');

const getFileNameFromUrl = url => url.substring(url.lastIndexOf('/') + 1);

const createTmpDirAsync = () =>
  new Promise((resolve, reject) => {
    tmp.dir((err, dirPath) => {
      if (err) {
        return reject(err);
      }

      return resolve(dirPath);
    });
  });

const downloadIconTempAsync = iconUrl =>
  createTmpDirAsync()
    .then(tmpPath =>
      new Promise((resolve, reject) => {
        const iconFileName = getFileNameFromUrl(iconUrl);
        const iconPath = path.join(tmpPath, iconFileName);
        const iconFile = fs.createWriteStream(iconPath);

        const req = https.get(iconUrl, (response) => {
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
      }),
    );

module.exports = downloadIconTempAsync;
