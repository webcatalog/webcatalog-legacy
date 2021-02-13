/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const semver = require('semver');
const os = require('os');

const isWindows10 = () => process.platform === 'win32' && semver.gt(os.release(), '10.0.0');

module.exports = isWindows10;
