/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
// widevine is not supported on Linux (ARM64) & Windows (x64 + arm64)

const isWidevineSupported = () => !(
  window.process.platform === 'win32'
  || (window.process.platform === 'linux' && window.process.platform !== 'x64'));

export default isWidevineSupported;
