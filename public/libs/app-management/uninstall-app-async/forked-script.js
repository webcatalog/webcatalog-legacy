const path = require('path');
const fsExtra = require('fs-extra');
const argv = require('yargs-parser')(process.argv.slice(1));

const {
  name,
  homePath,
} = argv;

const dotAppPath = path.join(homePath, 'Applications', 'WebCatalog Apps', `${name}.app`);
fsExtra.exists(dotAppPath)
  .then((exists) => {
    if (exists) return fsExtra.remove(dotAppPath);
    return null;
  })
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    process.send(e);
    process.exit(1);
  });

process.on('uncaughtException', (e) => {
  process.exit(1);
  process.send(e);
});
