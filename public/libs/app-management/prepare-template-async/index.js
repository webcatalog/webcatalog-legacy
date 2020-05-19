const path = require('path');
const { fork } = require('child_process');
const { app } = require('electron');

const customizedFetch = require('../../customized-fetch');
const sendToAllWindows = require('../../send-to-all-windows');
const { getPreference, getPreferences } = require('../../preferences');

// force re-extract for first installation after launch
global.forceExtract = true;

// GitHub API has rate limit & node-fetch doesn't support caching out-of-the-box
// Use caching and conditional request to ensure it's under limit
// See https://developer.github.com/v3/#conditional-requests
// Most responses return an ETag header.
// Many responses also return a Last-Modified header.
// You can use the values of these headers to make subsequent
// requests to those resources using the If-None-Match
// and If-Modified-Since headers, respectively.
// If the resource has not changed, the server will return a 304 Not Modified.
let cachedResponse = null;
const getTagNameAsync = () => Promise.resolve()
  .then(() => {
    const allowPrerelease = getPreference('allowPrerelease');

    const opts = {};
    if (cachedResponse) {
      opts.headers = {
        'If-None-Match': cachedResponse.etag,
      };
    }

    if (allowPrerelease === 'true') {
      return customizedFetch('https://api.github.com/repos/atomery/juli/releases', opts)
        .then((res) => {
          if (res.status === 304) {
            return null;
          }

          return res.json()
            .then((releases) => releases[0])
            .then((release) => release.tag_name)
            .then((tagName) => {
              cachedResponse = {
                etag: res.headers.get('etag'),
                tagName,
              };
            });
        });
    }

    return customizedFetch('https://api.github.com/repos/atomery/juli/releases/latest', opts)
      .then((res) => {
        if (res.status === 304) {
          return null;
        }

        return res.json()
          .then((release) => release.tag_name)
          .then((tagName) => {
            cachedResponse = {
              etag: res.headers.get('etag'),
              tagName,
            };
          });
      });
  })
  .then(() => cachedResponse.tagName);

const downloadExtractTemplateAsync = (tagName) => new Promise((resolve, reject) => {
  let latestTemplateVersion = '0.0.0';
  const scriptPath = path.join(__dirname, 'forked-script.js');

  const {
    proxyPacScript,
    proxyRules,
    proxyType,
  } = getPreferences();

  const child = fork(scriptPath, [
    '--appVersion',
    app.getVersion(),
    '--templatePath',
    path.join(app.getPath('userData'), 'webcatalog-template'),
    '--templateZipPath',
    path.join(app.getPath('userData'), 'webcatalog-template.zip'),
    '--platform',
    process.platform,
    '--arch',
    process.arch,
    '--tagName',
    tagName,
  ], {
    env: {
      ELECTRON_RUN_AS_NODE: 'true',
      ELECTRON_NO_ASAR: 'true',
      APPDATA: app.getPath('appData'),
      PROXY_PAC_SCRIPT: proxyPacScript,
      PROXY_RULES: proxyRules,
      PROXY_TYPE: proxyType,
      FORCE_EXTRACT: Boolean(global.forceExtract).toString(),
    },
  });

  let err = null;
  child.on('message', (message) => {
    if (message && message.versionInfo) {
      latestTemplateVersion = message.versionInfo.version;
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

const prepareTemplateAsync = () => getTagNameAsync()
  .then((tagName) => downloadExtractTemplateAsync(tagName));

module.exports = prepareTemplateAsync;
