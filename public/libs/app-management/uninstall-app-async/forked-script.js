require('source-map-support').install();

const path = require('path');
const fsExtra = require('fs-extra');
const sudo = require('sudo-prompt');
const { exec } = require('child_process');
const os = require('os');

const yargsParser = process.env.NODE_ENV === 'production' ? require('yargs-parser').default : require('yargs-parser');

const checkPathInUseAsync = require('../check-path-in-use-async');

const argv = yargsParser(process.argv.slice(1));
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
    if (engine === 'electron') {
      const userDataPath = path.join(appDataPath, name);
      p.push(checkExistsAndRemove(userDataPath));
    } if (engine.startsWith('firefox')) {
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
          firefoxUserDataPath = path.join(homePath, 'AppData', 'Roaming', 'Mozilla', 'Firefox');
        }
      }
      const profilesIniPath = path.join(firefoxUserDataPath, 'profiles.ini');

      p.push(
        fsExtra.pathExists(profilesIniPath)
          .then((exists) => {
            // If user has never opened Firefox app
            // profiles.ini doesn't exist
            if (!exists) return;
            const profilesIniContent = fsExtra.readFileSync(profilesIniPath, 'utf-8');

            // get profile path and delete it
            // https://coderwall.com/p/mrio6w/split-lines-cross-platform-in-node-js
            const entries = profilesIniContent.split(`${os.EOL}${os.EOL}`).map((entryText) => {
              /*
              [Profile0]
              Name=facebook
              IsRelative=1
              Path=Profiles/8kv8728b.facebook
              Default=1
              */
              const lines = entryText.split(os.EOL);

              const entry = {};
              lines.forEach((line, i) => {
                if (i === 0) {
                  // eslint-disable-next-line dot-notation
                  entry.Header = line;
                  return;
                }
                const parts = line.split(/=(.+)/);
                // eslint-disable-next-line prefer-destructuring
                entry[parts[0]] = parts[1];
              });

              return entry;
            });

            const profileDetails = entries.find((entry) => entry.Name === profileId);
            if (profileDetails && profileDetails.Path) {
              const profileDataPath = path.join(firefoxUserDataPath, profileDetails.Path);
              fsExtra.removeSync(profileDataPath);
            }

            // remove entry from profiles.init
            const modifiedProfilesIniContent = profilesIniContent
              .split(`${os.EOL}${os.EOL}`)
              .filter((x) => !x.includes(`Name=${profileId}`))
              .join(`${os.EOL}${os.EOL}`);

            fsExtra.writeFileSync(profilesIniPath, modifiedProfilesIniContent);
          }),
      );
    } else { // chromium-based browsers
      // forked-script-lite-v1
      p.push(checkExistsAndRemove(path.join(homePath, '.webcatalog', 'chromium-data', id)));
      // forked-script-lite-v2
      if (process.platform === 'darwin') {
        p.push(checkExistsAndRemove(path.join(webcatalogUserDataPath, 'ChromiumProfiles', id)));
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
