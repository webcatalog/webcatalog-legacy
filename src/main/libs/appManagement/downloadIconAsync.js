const { app } = require('electron');
const os = require('os');
const fs = require('fs');
const { https } = require('follow-redirects');

const getServerUrl = require('./getServerUrl');

const downloadIconAsync = (id, version) =>
  new Promise((resolve, reject) => {
    let iconExt;
    switch (os.platform()) {
      case 'darwin': {
        iconExt = 'icns';
        break;
      }
      case 'linux': {
        iconExt = 'png';
        break;
      }
      case 'win32':
      default: {
        iconExt = 'ico';
      }
    }

    const iconPath = `${app.getPath('temp')}/${Math.floor(Date.now())}.${iconExt}`;
    const iconFile = fs.createWriteStream(iconPath);

    const req = https.get(getServerUrl(`/s3/${id}.${iconExt}?v=${version}`), (response) => {
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

module.exports = downloadIconAsync;
