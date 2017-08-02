const createAppAsync = require('@webcatalog/molecule');
const { app } = require('electron');
const path = require('path');

const downloadIconTempAsync = require('./downloadIconTempAsync');

const installAppAsync = ({ id, name, url, icnsIconUrl }) =>
  downloadIconTempAsync(icnsIconUrl)
    .then((iconPath) => {
      const destPath = path.join(app.getPath('home'), 'Applications', 'WebCatalog Apps');

      process.noAsar = true;

      return createAppAsync(
        id,
        name,
        url,
        iconPath,
        destPath,
      );
    })
    .then(() => {
      process.noAsar = false;
    });

module.exports = installAppAsync;
