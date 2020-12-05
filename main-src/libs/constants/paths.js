/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const path = require('path');

const REACT_PATH = process.env.NODE_ENV === 'production'
  ? `file://${path.resolve(__dirname, 'index.html')}`
  : 'http://localhost:3000';

module.exports = {
  REACT_PATH,
};
