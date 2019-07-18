const argv = require('yargs-parser')(process.argv.slice(1));
const sudo = require('sudo-prompt');
const fsExtra = require('fs-extra');

const {
  moveFrom,
  moveTo,
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

Promise.resolve()
  .then(() => {
    const moveFromFull = moveFrom.replace('~', homePath);
    const moveToFull = moveTo.replace('~', homePath);

    if (fsExtra.pathExistsSync(moveFromFull)) {
      if (requireAdmin !== 'true') {
        return sudoAsync(`mv "${moveFromFull}"/* "${moveToFull}"/ && sudo /usr/sbin/chown -R ${username}:staff "${moveToFull}"`);
      }
      return sudoAsync(`mv "${moveFromFull}"/* "${moveToFull}"/`);
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
