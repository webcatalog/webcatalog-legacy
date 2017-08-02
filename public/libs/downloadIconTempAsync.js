const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const { https } = require('follow-redirects');

const getFileNameFromUrl = url => url.substring(url.lastIndexOf('/') + 1);

const downloadIconTempAsync = iconUrl =>
  new Promise((resolve, reject) => {
    const iconFileName = getFileNameFromUrl(iconUrl);
    const iconPath = path.join(app.getPath('temp'), iconFileName);
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
  });

module.exports = downloadIconTempAsync;
