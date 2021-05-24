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
    const electronVersion = fs.readJSONSync(path.join(templatePath, 'package.json')).devDependencies.electron;
    let lastUpdated = new Date().getTime();
    return downloadArtifact({
      version: `${electronVersion}-wvvmp`,
      artifactName: 'electron',
      cacheRoot: electronCachePath,
      platform,
      arch,
      mirrorOptions: {
        mirror: 'https://github.com/castlabs/electron-releases/releases/download/',
      },
      downloadOptions: {
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
      .then((cachedFilePath) => {
        // cachedFilePath = '~/Library/Caches/webcatalog/electron/34...9907/electron-v11.2.3-...zip'

        process.send({
          progress: {
            percent: 80,
            desc: 'Preparing...',
          },
        });

        const currentCacheDirName = path.basename(path.dirname(cachedFilePath));

        const cachedFiles = fs.readdirSync(electronCachePath);
        // remove cached of other versions of Electron
        const p = cachedFiles
          .filter((dirName) => dirName !== currentCacheDirName)
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
