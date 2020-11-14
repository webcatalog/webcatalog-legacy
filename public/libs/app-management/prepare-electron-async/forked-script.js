/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
require('source-map-support').install();
const ProxyAgent = require('proxy-agent');

const yargsParser = process.env.NODE_ENV === 'production' ? require('yargs-parser').default : require('yargs-parser');
const fs = require('fs-extra');
const path = require('path');

// temporary fix by using cjs (require() instead dynamic import)
// LimitChunkCountPlugin max chunks not working for dynamic import
// @electron/get uses import
// https://github.com/webpack/webpack/issues/11431
// https://stackoverflow.com/questions/53575157/limit-the-number-of-chunks-in-webpack-4
const { downloadArtifact } = require('@electron/get/dist/cjs');

const formatBytes = require('../../format-bytes');

const argv = yargsParser(process.argv.slice(1));
const {
  arch,
  platform,
  cacheRoot,
} = argv;

const electronCachePath = path.join(cacheRoot, 'electron');
const webcatalogEngineCachePath = path.join(cacheRoot, 'webcatalog-engine');
const templatePath = path.join(webcatalogEngineCachePath, 'template');

Promise.resolve()
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

    const electronVersion = fs.readJSONSync(path.join(templatePath, 'package.json')).devDependencies.electron;
    let lastUpdated = new Date().getTime();
    return downloadArtifact({
      version: electronVersion,
      artifactName: 'electron',
      cacheRoot: electronCachePath,
      platform,
      arch,
      downloadOptions: {
        agent: agent ? {
          http: agent,
          http2: agent,
          https: agent,
        } : undefined,
        getProgressCallback: (progress) => {
          // this step is appproximately takes 60% of the time
          // following after 20% of downloading the template (prepare-engine-async)
          // send every 1s to avoid too many rerendering
          const currentTime = new Date().getTime();
          // send every 2s to avoid too many rerendering
          if (currentTime - lastUpdated > 2000) {
            process.send({
              progress: {
                percent: Math.round(progress.percent * 60) + 20,
                desc: `Downloading Electron ${electronVersion} (${formatBytes(progress.transferred)}/${formatBytes(progress.total)})...`,
              },
            });
            lastUpdated = currentTime;
          }
        },
      },
    })
      .then(() => {
        process.send({
          progress: {
            percent: 80,
            desc: 'Preparing...',
          },
        });
      })
      .then(() => {
        const cachedFiles = fs.readdirSync(electronCachePath);
        // remove cached of other versions of Electron
        const p = cachedFiles
          .filter((dirName) => !dirName.includes(`v${electronVersion}`))
          .map((dirName) => fs.remove(path.join(electronCachePath, dirName)));
        return Promise.all(p);
      });
  })
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
