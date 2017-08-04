const createAppAsync = require('@webcatalog/molecule');
const argv = require('yargs-parser')(process.argv.slice(1));

const downloadIconTempAsync = require('./downloadIconTempAsync');

const { id, name, url, icnsIconUrl, destPath } = argv;

downloadIconTempAsync(icnsIconUrl)
  .then(iconPath =>
    createAppAsync(
      id,
      name,
      url,
      iconPath,
      destPath,
    ),
  )
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    process.send(e);
  });

process.on('uncaughtException', (e) => {
  process.send(e);
});
