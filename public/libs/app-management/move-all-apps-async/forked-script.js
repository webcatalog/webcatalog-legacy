const argv = require('yargs-parser')(process.argv.slice(1));
const path = require('path');
const sudo = require('sudo-prompt');
const fsExtra = require('fs-extra');

const {
  moveFrom,
  homePath,
  username,
} = argv;

const homeAllAppsPath = path.join(homePath, 'Applications', 'WebCatalog Apps');
const rootAllAppsPath = path.join('/', 'Applications', 'WebCatalog Apps');

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

Promise.resolve()
  .then(() => {
    if (fsExtra.pathExistsSync(moveFrom === 'root' ? rootAllAppsPath : homeAllAppsPath)) {
      if (moveFrom === 'root') {
        return sudoAsync(`mv "${rootAllAppsPath}" "${homeAllAppsPath}" && sudo /usr/sbin/chown -R ${username}:staff "${homeAllAppsPath}"`);
      }
      return sudoAsync(`mv "${homeAllAppsPath}" "${rootAllAppsPath}"`);
    }
    return null;
  })
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    /* eslint-disable-next-line */
    process.send(e);
    process.exit(1);
  });

process.on('uncaughtException', (e) => {
  process.exit(1);
  process.send(e);
});
