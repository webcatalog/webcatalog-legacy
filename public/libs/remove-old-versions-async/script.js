const path = require('path');
const argv = require('yargs-parser')(process.argv.slice(1));
const fs = require('fs-extra');

const {
  moleculeVersion,
  homePath,
} = argv;

const versionPath = path.join(homePath, '.webcatalog', 'versions', moleculeVersion);

fs.remove(versionPath)
  .then(() => {
    process.exit(0);
  })
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
