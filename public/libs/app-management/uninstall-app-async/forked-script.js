const path = require('path');
const fsExtra = require('fs-extra');
const argv = require('yargs-parser')(process.argv.slice(1));
const sudo = require('sudo-prompt');

const {
  name,
  installationPath,
  requireAdmin,
  homePath,
  username,
} = argv;

const sudoAsync = prompt => new Promise((resolve, reject) => {
  const opts = {
    name: 'WebCatalog',
  };
  console.log(prompt);
  process.env.USER = username;
  sudo.exec(prompt, opts, (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      return reject(error);
    }
    console.log(stdout);
    console.log(stderr);
    return resolve(stdout, stderr);
  });
});

const checkExistsAndRemove = dirPath => fsExtra.exists(dirPath)
  .then((exists) => {
    if (exists) return fsExtra.remove(dirPath);
    return null;
  });

const checkExistsAndRemoveWithSudo = dirPath => fsExtra.exists(dirPath)
  .then((exists) => {
    if (exists) return sudoAsync(`rm -rf "${dirPath}"`);
    return null;
  });

const dotAppPath = path.join(installationPath.replace('~', homePath), `${name}.app`);
const appDataPath = path.join(homePath, 'Library', 'Application Support', name);

Promise.resolve()
  .then(() => {
    if (requireAdmin === 'true') {
      return checkExistsAndRemoveWithSudo(dotAppPath);
    }
    return checkExistsAndRemove(dotAppPath);
  })
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
