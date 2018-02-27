const path = require('path');
const argv = require('yargs-parser')(process.argv.slice(1));
const fs = require('fs-extra');

const {
  allAppPath,
  appName,
  homePath,
} = argv;

const uninstallAppAsync = () => {
  const p = [];
  const appPath = path.join(allAppPath, `${appName}.app`);
  p.push(fs.remove(appPath));

  const altAppPath = path.join(homePath, '.webcatalog', `${appName}.app`);
  p.push(fs.remove(altAppPath));

  return Promise.all(p);
};

uninstallAppAsync()
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
