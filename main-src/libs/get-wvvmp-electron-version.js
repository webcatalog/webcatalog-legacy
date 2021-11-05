/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// The v16 series of Electron for Content Security, labeled wvcus,
// moves to using the Component Updater Service to handle installation
// of the Widevine CDM, and has incompatible API updates compared to the previous wvvmp releases.
const semver = require('semver');

const getCastlabsElectronVersion = (electronVersion) => {
  // '14.0.0-beta.9' to '14.0.0-beta.9+wvcus'
  // '14.0.0' to '14.0.0+wvcus'
  if (semver.gte('16.0.0-beta.6')) {
    return `${electronVersion}+wvcus`;
  }

  // '14.0.0-beta.9' to '14.0.0-wvvmp-beta.9'
  // '14.0.0' to '14.0.0-wvvmp'
  const versionParts = electronVersion.split('-');
  versionParts.splice(1, 0, 'wvvmp');
  return versionParts.join('-');
};

module.exports = getCastlabsElectronVersion;
