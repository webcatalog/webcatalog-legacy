/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// use Electron `net` module
const electronFetch = require('electron-fetch').default;
// use Node `http` and `https` module
const nodeFetch = require('node-fetch').default;

// electron-fetch (`net` module) uses OS trusted certficiates list
// so if the OS (e.g. macOS 10.11) is not up-to-date
// the request might fail as trusted certficiates list doesn't include latest root certificates
// see https://github.com/electron/electron/issues/31368 for details
const customizedFetch = (url, opts, ...args) => electronFetch(url, opts, ...args)
  // if electron-fetch fails, attempt again using node-fetch (Node `http` and `https` module)
  // which uses bundled root certficiates list
  .catch((err) => {
    if (err && err.code === 'ERR_CERT_DATE_INVALID') {
      return nodeFetch(url, opts, ...args);
    }
    return Promise.reject(err);
  });

module.exports = customizedFetch;
