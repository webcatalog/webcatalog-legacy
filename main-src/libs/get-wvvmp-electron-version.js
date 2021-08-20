/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// '14.0.0-beta.9' to '14.0.0-wvvmp-beta.9'
// '14.0.0' to '14.0.0-wvvmp'
const getWvvmpElectronVersion = (electronVersion) => {
  const versionParts = electronVersion.split('-');
  versionParts.splice(1, 0, 'wvvmp');
  return versionParts.join('-');
};

module.exports = getWvvmpElectronVersion;
