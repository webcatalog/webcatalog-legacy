/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const electron = require('electron');
const { init } = require('@sentry/electron');

const isRenderer = (process && process.type === 'renderer');

init({
  dsn: 'https://62e7e07974474987bda9a65063758b30@o433326.ingest.sentry.io/5390548',
  release: isRenderer ? electron.remote.app.getVersion() : electron.app.getVersion(),
});
