/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const path = require('path');
const semver = require('semver');
const NodeCache = require('node-cache');
const { fork } = require('child_process');
const { app } = require('electron');
const envPaths = require('env-paths');
const { addBreadcrumb } = require('@sentry/electron');

const customizedFetch = require('../../customized-fetch');
const sendToAllWindows = require('../../send-to-all-windows');
const { getPreference } = require('../../preferences');

// force re-extract for first installation after launch
global.forceExtract = true;

const cache = new NodeCache();

// use in-house API
// to avoid using GitHub API as it has rate limit (60 requests per hour)
// https://github.com/webcatalog/webcatalog-app/issues/890
const getTagNameAsync = () => Promise.resolve()
  .then(() => {
    const allowPrerelease = getPreference('allowPrerelease');

    // check both prerelease and stable channels
    // return the newer version
    if (allowPrerelease) {
      return Promise.resolve()
        .then(() => {
          let stableVersion;
          let prereleaseVersion;
          const p = [
            customizedFetch('https://webcatalog.app/webkit-wrapper/releases/latest.json')
              .then((res) => res.json())
              .then((data) => { stableVersion = data.version; }),
            customizedFetch('https://webcatalog.app/webkit-wrapper/releases/prerelease.json')
              .then((res) => res.json())
              .then((data) => { prereleaseVersion = data.version; }),
          ];
          return Promise.all(p)
            .then(() => {
              if (semver.gt(stableVersion, prereleaseVersion)) {
                return stableVersion;
              }
              return prereleaseVersion;
            });
        })
        .then((version) => `v${version}`);
    }

    return customizedFetch('https://webcatalog.app/webkit-wrapper/releases/latest.json')
      .then((res) => res.json())
      .then((data) => `v${data.version}`);
  });

const downloadTemplateAsync = (tagName) => new Promise((resolve, reject) => {
  const cacheRoot = envPaths('webcatalog', {
    suffix: '',
  }).cache;

  let latestTemplateVersion = '0.0.0';
  const scriptPath = path.join(__dirname, 'prepare-webkit-wrapper-forked.js')
    .replace('app.asar', 'app.asar.unpacked');

  const args = [
    '--appVersion',
    app.getVersion(),
    '--cacheRoot',
    cacheRoot,
    '--platform',
    process.platform,
    '--arch',
    process.arch,
    '--tagName',
    tagName,
  ];

  const cachedTemplateInfoJson = cache.get(`templateInfoJson.${tagName}`);
  if (cachedTemplateInfoJson) {
    args.push('--templateInfoJson');
    args.push(cachedTemplateInfoJson);
  }

  addBreadcrumb({
    category: 'run-forked-script',
    message: 'prepare-engine-async',
    data: {
      cacheRoot,
    },
  });

  const child = fork(scriptPath, args, {
    env: {
      ELECTRON_RUN_AS_NODE: 'true',
      ELECTRON_NO_ASAR: 'true',
      APPDATA: app.getPath('appData'),
      FORCE_EXTRACT: Boolean(global.forceExtract).toString(),
    },
  });

  let err = null;
  child.on('message', (message) => {
    if (message && message.templateInfo) {
      latestTemplateVersion = message.templateInfo.version;
      // cache template info for the tag name indefinitely (until app is quitted)
      cache.set(`templateInfoJson.${tagName}`, JSON.stringify(message.templateInfo));
    } else if (message && message.progress) {
      sendToAllWindows('update-installation-progress', message.progress);
    } else if (message && message.error) {
      err = new Error(message.error.message);
      err.stack = message.error.stack;
      err.name = message.error.name;
    } else {
      console.log(message); // eslint-disable-line no-console
    }
  });

  child.on('exit', (code) => {
    if (code === 1) {
      reject(err || new Error('Forked script failed to run correctly.'));
      return;
    }

    // // extracting template code successful so need to re-extract next time
    global.forceExtract = false;

    resolve(latestTemplateVersion);
  });
});

const prepareWebkitWrapperAsync = () => {
  if (process.platform !== 'darwin') {
    return Promise.reject(new Error('Unsupported platform'));
  }
  return getTagNameAsync()
    .then((tagName) => downloadTemplateAsync(tagName));
};

module.exports = prepareWebkitWrapperAsync;
