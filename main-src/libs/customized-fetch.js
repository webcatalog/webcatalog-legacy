/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const fetch = process.env.NODE_ENV === 'production' ? require('node-fetch').default : require('node-fetch');

const customizedFetch = (url, opts, ...args) => fetch(url, opts, ...args);

module.exports = customizedFetch;
