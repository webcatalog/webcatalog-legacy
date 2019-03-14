const path = require('path');
const fsExtra = require('fs-extra');
const argv = require('yargs-parser')(process.argv.slice(1));

const {
  name,
  homePath,
} = argv;

const checkExistsAndRemove = dirPath => fsExtra.exists(dirPath)
  .then((exists) => {
    if (exists) return fsExtra.remove(dirPath);
    return null;
  });

const dotAppPath = path.join(homePath, 'Applications', 'WebCatalog Apps', `${name}.app`);
const appDataPath = path.join(homePath, 'Library', 'Application Support', name);

checkExistsAndRemove(dotAppPath)
  .then(() => checkExistsAndRemove(appDataPath))
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
