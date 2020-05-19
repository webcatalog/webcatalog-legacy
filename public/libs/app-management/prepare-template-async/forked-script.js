const ProxyAgent = require('proxy-agent');
const argv = require('yargs-parser')(process.argv.slice(1));
const axios = require('axios');
const decompress = require('decompress');
const fs = require('fs-extra');
const hasha = require('hasha');
const path = require('path');
const semver = require('semver');

const customizedFetch = require('../../customized-fetch');
const formatBytes = require('../../format-bytes');

const {
  appVersion,
  arch,
  platform,
  tagName,
  templatePath,
  templateZipPath,
} = argv;

customizedFetch(`https://github.com/atomery/juli/releases/download/${tagName}/template-${platform}-${arch}.json`)
  .then((res) => res.json())
  .then((templateInfo) => Promise.resolve()
    .then(() => {
      process.send({
        versionInfo: {
          version: templateInfo.version,
        },
      });

      if (semver.lt(appVersion, templateInfo.minimumWebCatalogVersion)) {
        return Promise.reject(new Error('WebCatalog is outdated. Please update WebCatalog first to continue.'));
      }

      // return shouldDownload
      if (fs.pathExistsSync(templateZipPath)) {
        return hasha.fromFile(templateZipPath, { algorithm: 'sha256' })
          .then((localSha256) => localSha256 !== templateInfo.sha256);
      }

      return true;
    })
    .then((shouldDownload) => {
      if (shouldDownload) {
        console.log(`Downloading template code zip to ${templateZipPath}...`); // eslint-disable-line no-console
        return fs.remove(templateZipPath)
          .then(() => fs.remove(templatePath))
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
                // downloading template takes about 80% of the total installation time
                const currentTime = new Date().getTime();
                // send every 1s to avoid too many rerendering
                if (currentTime - lastUpdated > 1000) {
                  process.send({
                    progress: {
                      percent: Math.round((downloadedLength / totalLength) * 80),
                      desc: `Downloading additional files (${formatBytes(downloadedLength)}/${formatBytes(totalLength)})...`,
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
          .then(() => hasha.fromFile(templateZipPath, { algorithm: 'sha256' }))
          .then((sha256) => {
            if (sha256 !== templateInfo.sha256) {
              return Promise.reject(new Error('Downloaded template code zip is corrupted (validated with SHA256).'));
            }
            return null;
          });
      }
      return null;
    })
    .then(() => {
      // return shouldExtract
      // extracting is expensive so try not to do it too many times
      if (process.env.FORCE_EXTRACT === 'true') { // see error handling installAppAsync for usage
        return true;
      }

      if (fs.pathExistsSync(templatePath)) {
        const templateJsonPath = path.join(templatePath, 'package.json');
        const templatePackageJson = fs.readJsonSync(templateJsonPath);
        // redundant check as the previous step already wipes out template dir
        // but check anyway to be certain
        return templatePackageJson.version !== templateInfo.version;
      }

      return true;
    })
    .then((shouldExtract) => {
      if (shouldExtract) {
        // when extraction is started, 80% (downloading) is already done
        process.send({
          progress: {
            percent: 80,
            desc: 'Extracting additional files...',
          },
        });
        console.log(`Extracting template code to ${templatePath}...`); // eslint-disable-line no-console
        return fs.remove(templatePath)
          .then(() => decompress(templateZipPath, templatePath));
      }
      return null;
    }))
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
