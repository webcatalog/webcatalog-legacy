/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const isDev = require('electron-is-dev');
const path = require('path');

const REACT_PATH = isDev ? 'http://localhost:3000' : `file://${path.resolve(__dirname, 'index.html')}`;

module.exports = {
  REACT_PATH,
};
