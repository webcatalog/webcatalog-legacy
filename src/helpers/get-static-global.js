/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// cached global values to improve performance
// most of global values are static, unchanged
// so we don't need to keep getting update from remote
// https://github.com/electron/electron/issues/1258
const cached = {};

const getStaticGlobal = (key) => {
  if (!cached[key]) {
    cached[key] = window.remote.getGlobal(key);
  }

  return cached[key];
};

export default getStaticGlobal;
