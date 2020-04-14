const path = require('path');
const fsExtra = require('fs-extra');
const argv = require('yargs-parser')(process.argv.slice(1));
const sudo = require('sudo-prompt');

const {
  appDataPath,
  desktopPath,
  engine,
  homePath,
  id,
  installationPath,
  name,
  requireAdmin,
  username,
} = argv;

const sudoAsync = (prompt) => new Promise((resolve, reject) => {
  const opts = {
    name: 'WebCatalog',
  };
  process.env.USER = username;
  sudo.exec(prompt, opts, (error, stdout, stderr) => {
    if (error) {
      return reject(error);
    }
    return resolve(stdout, stderr);
  });
});

const checkExistsAndRemove = (dirPath) => fsExtra.exists(dirPath)
  .then((exists) => {
    if (exists) return fsExtra.remove(dirPath);
    return null;
  });

const checkExistsAndRemoveWithSudo = (dirPath) => fsExtra.exists(dirPath)
  .then((exists) => {
    if (exists) return sudoAsync(`rm -rf "${dirPath}"`);
    return null;
  });

const dotAppPath = process.platform === 'darwin'
  ? path.join(installationPath.replace('~', homePath), `${name}.app`)
  : path.join(installationPath.replace('~', homePath), `${name}`);

Promise.resolve()
  .then(() => {
    if (requireAdmin === 'true') {
      return checkExistsAndRemoveWithSudo(dotAppPath);
    }
    return checkExistsAndRemove(dotAppPath);
  })
  .then(() => {
    const p = [];
    // remove userData
    // userData The directory for storing your app's configuration files,
    // which by default it is the appData directory appended with your app's name.
    if (process.platform === 'darwin') {
      if (engine === 'electron') {
        const userDataPath = path.join(appDataPath, name);
        p.push(checkExistsAndRemove(userDataPath));
      } else if (engine !== 'firefox') { // chromium-based browsers
        // forked-script-lite-v1
        p.push(checkExistsAndRemove(path.join(homePath, '.webcatalog', 'chromium-data', id)));
        // forked-script-lite-v2
        p.push(checkExistsAndRemove(path.join(homePath, 'Library', 'Application Support', 'WebCatalog', 'ChromiumProfiles', id)));
      }
    }

    if (process.platform === 'linux') {
      const desktopFilePath = path.join(homePath, '.local', 'share', 'applications', `webcatalog-${id}.desktop`);
      p.push(checkExistsAndRemove(desktopFilePath));
    }

    if (process.platform === 'win32') {
      const startMenuPath = path.join(homePath, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps');
      const startMenuShortcutPath = path.join(startMenuPath, `${name}.lnk`);
      const desktopShortcutPath = path.join(desktopPath, `${name}.lnk`);

      p.push(checkExistsAndRemove(startMenuShortcutPath));
      p.push(checkExistsAndRemove(desktopShortcutPath));
    }

    return Promise.all(p);
  })
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    process.send({
      error: {
        name: e.name,
        message: e.message,
        stack: e.stack,
      },
    });
    process.exit(1);
  });

process.on('uncaughtException', (e) => {
  process.send({
    error: {
      name: e.name,
      message: e.message,
      stack: e.stack,
    },
  });
  process.exit(1);
});
