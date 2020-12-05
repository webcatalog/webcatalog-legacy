/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
require('source-map-support').install();

// set this event as soon as possible in the process
process.on('uncaughtException', (e) => {
  process.send({
    error: {
      name: e.name,
      message: e.message,
      stack: e.stack,
    },
  });
  process.exit(1);
});

const ProxyAgent = require('proxy-agent');
const yargsParser = process.env.NODE_ENV === 'production' ? require('yargs-parser').default : require('yargs-parser');
const axios = require('axios');
const fs = require('fs-extra');
const hasha = require('hasha');
const path = require('path');
const semver = require('semver');

const customizedFetch = require('../../customized-fetch');
const formatBytes = require('../../format-bytes');

const argv = yargsParser(process.argv.slice(1));
const {
  appVersion,
  tagName,
  templateInfoJson,
  cacheRoot,
} = argv;

const cachePath = path.join(cacheRoot, 'webkit-wrapper');
const templateZipPath = path.join(cachePath, 'template.zip');
const templateJsonPath = path.join(cachePath, 'template.json');

Promise.resolve()
  .then(() => fs.ensureDir(cachePath))
  .then(() => {
    if (templateInfoJson) {
      return JSON.parse(templateInfoJson);
    }

    return customizedFetch(`https://github.com/webcatalog/webkit-wrapper/releases/download/${tagName}/template-macos.json`)
      .then((res) => res.json());
  })
  .then((templateInfo) => Promise.resolve()
    .then(() => {
      process.send({
        templateInfo,
      });

      if (semver.lt(appVersion, templateInfo.minimumWebCatalogVersion)) {
        return Promise.reject(new Error('WebCatalog is outdated. Please update WebCatalog first to continue.'));
      }

      // return shouldDownload
      if (fs.pathExistsSync(templateZipPath)) {
        // do not use hasha.fromFile as it uses worker which is incompatible with webpack setup
        const localSha256 = hasha.fromFileSync(templateZipPath, { algorithm: 'sha256' });
        return localSha256 !== templateInfo.sha256;
      }

      return true;
    })
    .then((shouldDownload) => {
      if (shouldDownload) {
        process.send({
          progress: {
            percent: 10,
            desc: `Downloading WebKit Wrapper (${templateInfo.version})...`,
          },
        });
        console.log(`Downloading template code zip to ${templateZipPath}...`); // eslint-disable-line no-console
        return fs.remove(templateZipPath)
          .then(() => {
            const proxyPacScript = process.env.PROXY_PAC_SCRIPT;
            const proxyRules = process.env.PROXY_RULES;
            const proxyType = process.env.PROXY_TYPE;

            // create proxy agent
            let agent;
            if (proxyType === 'rules') {
              agent = new ProxyAgent(proxyRules);
            } else if (proxyType === 'pacScript') {
              agent = new ProxyAgent(`pac+${proxyPacScript}`);
            }

            return axios({
              method: 'get',
              url: templateInfo.downloadUrl,
              responseType: 'stream',
              httpsAgent: agent,
              httpAgent: agent,
            }).then((response) => new Promise((resolve, reject) => {
              // https://futurestud.io/tutorials/axios-download-progress-in-node-js
              const totalLength = response.headers['content-length'];
              let downloadedLength = 0;
              let lastUpdated = new Date().getTime();
              response.data.on('data', (chunk) => {
                downloadedLength += chunk.length;
                // downloading template takes about 20% of the total installation time
                const currentTime = new Date().getTime();
                // send every 2s to avoid too many rerendering
                if (currentTime - lastUpdated > 2000) {
                  process.send({
                    progress: {
                      percent: Math.round((downloadedLength / totalLength) * 20),
                      desc: `Downloading WebCatalog Engine ${templateInfo.version} (${formatBytes(downloadedLength)}/${formatBytes(totalLength)})...`,
                    },
                  });
                  lastUpdated = currentTime;
                }
              });
              const writer = fs.createWriteStream(templateZipPath);
              response.data.pipe(writer);
              writer.on('finish', () => {
                resolve();
              });
              writer.on('error', (err) => {
                reject(err);
              });
            }));
          })
          // do not use hasha.fromFile as it uses worker which is incompatible with webpack setup
          .then(() => hasha.fromFileSync(templateZipPath, { algorithm: 'sha256' }))
          .then((sha256) => {
            if (sha256 !== templateInfo.sha256) {
              return Promise.reject(new Error('Downloaded template code zip is corrupted (validated with SHA256).'));
            }
            return null;
          });
      }
      return null;
    })
    .then(() => fs.writeJSON(templateJsonPath, templateInfo)))
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    process.send({
      error: {
        name: e.name,
        message: e.message,
        stack: e.stack,
      },
    });
    process.exit(1);
  });
