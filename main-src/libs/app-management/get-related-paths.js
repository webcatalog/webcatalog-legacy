/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const path = require('path');
const os = require('os');
const fsExtra = require('fs-extra');
const semver = require('semver');

const getRelatedPaths = ({
  appObj,
  installationPath,
  homePath,
  appDataPath,
  userDataPath,
  desktopPath,
  // installationPath = getPreference('installationPath'),
  // homePath = app.getPath('home'),
}) => {
  const {
    id,
    name,
    engine,
  } = appObj;

  const relatedPaths = [];

  // App
  const dotAppPath = process.platform === 'darwin'
    ? path.join(installationPath.replace('~', homePath), `${name}.app`)
    : path.join(installationPath.replace('~', homePath), `${name}`);

  relatedPaths.push({ path: dotAppPath, type: 'app' });

  const resourcesPath = process.platform === 'darwin'
    ? path.join(dotAppPath, 'Contents', 'Resources')
    : path.join(dotAppPath, 'resources');

  const packageJsonPath = path.join(resourcesPath, 'app.asar.unpacked', 'package.json');
  const appJsonPath = path.join(resourcesPath, 'app.asar.unpacked', 'build', 'app.json');
  const { legacyUserData } = fsExtra.readJSONSync(appJsonPath);
  const { version } = fsExtra.readJSONSync(packageJsonPath);

  // Data
  switch (engine) {
    case 'webkit': {
      relatedPaths.push({
        path: path.join(homePath, 'Library', 'WebKit', `com.webcatalog.webkit.${id}`),
        type: 'data',
      });
      relatedPaths.push({
        path: path.join(homePath, 'Caches', `com.webcatalog.webkit.${id}`),
        type: 'data',
      });
      break;
    }
    case 'electron': {
      // remove userData
      // userData The directory for storing your app's configuration files,
      // which by default it is the appData directory appended with your app's name.
      // default Electron user data path for apps are used by WebCatalog Engine < 14.x
      // or if legacyUserData = true is set in app.json
      if (legacyUserData || semver.lt(version, '14.0.0')) {
        relatedPaths.push({
          path: path.join(appDataPath, name),
          type: 'data',
        });
      } else {
        relatedPaths.push({
          path: path.join(appDataPath, 'WebCatalog', 'WebCatalogEngineData', id),
          type: 'data',
        });
      }
      break;
    }
    case 'firefox': {
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

      const exists = fsExtra.pathExistsSync(profilesIniPath);
      // If user has never opened Firefox app
      // profiles.ini doesn't exist
      if (exists) {
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
          relatedPaths.push({
            path: profileDataPath,
            type: 'data',
          });
        }
      }
      break;
    }
    // Chromium-based browsers
    default: {
      // chromium-based browsers
      // forked-script-lite-v2
      if (process.platform === 'darwin') {
        relatedPaths.push({
          path: path.join(userDataPath, 'ChromiumProfiles', id),
          type: 'data',
        });
      } else {
        // forked-script-lite-v1
        relatedPaths.push({
          path: path.join(homePath, '.webcatalog', 'chromium-data', id),
          type: 'data',
        });
      }
    }
  }

  // Shortcuts
  if (process.platform === 'linux') {
    const desktopFilePath = path.join(homePath, '.local', 'share', 'applications', `webcatalog-${id}.desktop`);
    relatedPaths.push({ path: desktopFilePath, type: 'shortcut' });
  } else if (process.platform === 'win32') {
    const startMenuPath = path.join(homePath, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps');
    const startMenuShortcutPath = path.join(startMenuPath, `${name}.lnk`);
    const desktopShortcutPath = path.join(desktopPath, `${name}.lnk`);

    relatedPaths.push({ path: startMenuShortcutPath, type: 'shortcut' });
    relatedPaths.push({ path: desktopShortcutPath, type: 'shortcut' });
  }

  return relatedPaths;
};

module.exports = getRelatedPaths;
