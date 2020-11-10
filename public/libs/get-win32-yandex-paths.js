/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
// https://github.com/GoogleChrome/chrome-launcher/blob/master/src/chrome-finder.ts

const fs = require('fs-extra');
const path = require('path');

const canAccess = (file) => {
  if (!file) {
    return false;
  }

  try {
    fs.accessSync(file);
    return true;
  } catch (e) {
    return false;
  }
};

const getWin32YandexPaths = () => {
  const installations = [];
  const suffixes = [
    `${path.sep}Yandex${path.sep}YandexBrowser${path.sep}Application${path.sep}browser.exe`,
  ];
  const prefixes = [process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']].filter(Boolean);

  prefixes.forEach((prefix) => suffixes.forEach((suffix) => {
    const chromePath = path.join(prefix, suffix);
    if (canAccess(chromePath)) {
      installations.push(chromePath);
    }
  }));

  return installations;
};

module.exports = getWin32YandexPaths;
