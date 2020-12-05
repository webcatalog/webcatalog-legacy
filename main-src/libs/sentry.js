/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const electron = require('electron');
const { init } = require('@sentry/electron');

const isRenderer = (process && process.type === 'renderer');

if (process.env.ELECTRON_APP_SENTRY_DSN) {
  init({
    dsn: process.env.ELECTRON_APP_SENTRY_DSN,
    release: isRenderer ? electron.remote.app.getVersion() : electron.app.getVersion(),
  });
}
