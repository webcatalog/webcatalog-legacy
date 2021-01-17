/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
require('source-map-support').install();

// set this event as soon as possible in the process
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

const path = require('path');
const fsExtra = require('fs-extra');
const sudo = require('sudo-prompt');
const { exec } = require('child_process');
const os = require('os');

const yargsParser = process.env.NODE_ENV === 'production' ? require('yargs-parser').default : require('yargs-parser');

const checkPathInUseAsync = require('../check-path-in-use-async');
const getRelatedPaths = require('../get-related-paths');

// id, name, username might only contain numbers
// causing yargsParser to parse them correctly as Number instead of String
// so it's neccessary to explitcity state their types
const argv = yargsParser(process.argv.slice(1), { string: ['id', 'name', 'username'] });
const {
  appDataPath,
  desktopPath,
  engine,
  homePath,
  id,
  installationPath,
  name,
  username,
  webcatalogUserDataPath,
} = argv;

// ignore requireAdmin if installationPath is not custom
const isStandardInstallationPath = installationPath === '~/Applications/WebCatalog Apps'
|| installationPath === '/Applications/WebCatalog Apps';
const requireAdmin = isStandardInstallationPath ? false : argv.requireAdmin;

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

const execAsync = (cmd) => new Promise((resolve, reject) => {
  exec(cmd, (e, stdout, stderr) => {
    if (e instanceof Error) {
      reject(e);
      return;
    }

    if (stderr) {
      reject(new Error(stderr));
      return;
    }

    resolve(stdout);
  });
});

const dotAppPath = process.platform === 'darwin'
  ? path.join(installationPath.replace('~', homePath), `${name}.app`)
  : path.join(installationPath.replace('~', homePath), `${name}`);

Promise.resolve()
  .then(() => {
    if (process.platform === 'win32') {
      return checkPathInUseAsync(dotAppPath);
    }
    // skip this check on Mac & Linux
    // as on Unix, it's possible to replace files even when running
    // https://askubuntu.com/questions/44339/how-does-updating-running-application-binaries-during-an-upgrade-work
    return false;
  })
  .then(() => {
    if (requireAdmin === 'true') {
      return checkExistsAndRemoveWithSudo(dotAppPath);
    }
    return checkExistsAndRemove(dotAppPath);
  })
  .then(async () => {
    // in v20.5.2 and below, '/Applications/WebCatalog Apps' owner is set to `root`
    // need to correct to user to install apps without sudo
    if (installationPath === '/Applications/WebCatalog Apps') {
      // https://unix.stackexchange.com/a/7732
      const installationPathOwner = await execAsync("ls -ld '/Applications/WebCatalog Apps' | awk '{print $3}'");
      if (installationPathOwner.trim() === 'root') {
        // https://askubuntu.com/questions/6723/change-folder-permissions-and-ownership
        // https://stackoverflow.com/questions/23714097/sudo-chown-command-not-found
        await sudoAsync(`/usr/sbin/chown -R ${username} '/Applications/WebCatalog Apps'`);
      }
    }
  })
  .then(() => {
    const relatedPaths = getRelatedPaths({
      appObj: {
        id,
        name,
        engine,
      },
      installationPath,
      homePath,
      appDataPath,
      userDataPath: webcatalogUserDataPath,
      desktopPath,
    });

    const p = relatedPaths
      .filter((pathDetails) => pathDetails.type !== 'app')
      .map((pathDetails) => fsExtra.remove(pathDetails.path));
    return Promise.all(p);
  })
  .then(() => {
    if (engine.startsWith('firefox')) {
      const profileId = `webcatalog-${id}`;

      let firefoxUserDataPath;
      switch (process.platform) {
        case 'darwin': {
          firefoxUserDataPath = path.join(homePath, 'Library', 'Application Support', 'Firefox');
          break;
        }
        case 'linux': {
          firefoxUserDataPath = path.join(homePath, '.mozilla', 'firefox');
          break;
        }
        case 'win32':
        default: {
          firefoxUserDataPath = path.join(appDataPath, 'Mozilla', 'Firefox');
        }
      }
      const profilesIniPath = path.join(firefoxUserDataPath, 'profiles.ini');

      return fsExtra.pathExists(profilesIniPath)
        .then((exists) => {
          // If user has never opened Firefox app
          // profiles.ini doesn't exist
          if (!exists) return;
          const profilesIniContent = fsExtra.readFileSync(profilesIniPath, 'utf-8');

          // remove entry from profiles.init
          const modifiedProfilesIniContent = profilesIniContent
            .split(`${os.EOL}${os.EOL}`)
            .filter((x) => !x.includes(`Name=${profileId}`))
            .join(`${os.EOL}${os.EOL}`);

          fsExtra.writeFileSync(profilesIniPath, modifiedProfilesIniContent);
        });
    }
    return null;
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
