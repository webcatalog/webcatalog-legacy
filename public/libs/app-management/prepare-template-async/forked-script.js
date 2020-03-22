const argv = require('yargs-parser')(process.argv.slice(1));
const decompress = require('decompress');
const fs = require('fs-extra');
const hasha = require('hasha');
const path = require('path');

const customizedFetch = require('../../customized-fetch');
const downloadAsync = require('../../download-async');

const {
  appVersion,
  templatePath,
  templateZipPath,
  platform,
  arch,
} = argv;

let cachedFetchTemplateInfoAsync;
const fetchTemplateInfoAsync = () => {
  if (cachedFetchTemplateInfoAsync) {
    return Promise.resolve(cachedFetchTemplateInfoAsync);
  }

  return customizedFetch(`https://github.com/atomery/webcatalog/releases/download/v${appVersion}/template-${process.platform}-${process.arch}.json`)
    .then((res) => res.json())
    .then((fetchedJson) => {
      cachedFetchTemplateInfoAsync = {
        ...fetchedJson, // version, sha256
        zipUrl: `https://github.com/atomery/webcatalog/releases/download/v${appVersion}/template-${platform}-${arch}.zip`,
      };
      return cachedFetchTemplateInfoAsync;
    });
};

fetchTemplateInfoAsync()
  .then((templateInfo) => Promise.resolve()
    .then(async () => {
      let shouldDownload = false;
      if (fs.pathExistsSync(templateZipPath)) {
        const localSha256 = await hasha.fromFile(templateZipPath, { algorithm: 'sha256' });
        shouldDownload = localSha256 !== templateInfo.sha256;
      } else {
        shouldDownload = true;
      }

      if (shouldDownload) {
        console.log(`Downloading template code zip to ${templateZipPath}...`); // eslint-disable-line no-console
        return fs.remove(templateZipPath)
          .then(() => fs.remove(templatePath))
          .then(() => downloadAsync(templateInfo.zipUrl, templateZipPath))
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
      // extracting is expensive so try not to do it too many times
      let shouldExtract = false;
      if (process.env.FORCE_EXTRACT === 'true') { // see error handling installAppAsync for usage
        shouldExtract = true;
      } else if (fs.pathExistsSync(templatePath)) {
        const templateJsonPath = path.join(templatePath, 'package.json');
        const templatePackageJson = fs.readJsonSync(templateJsonPath);
        // redundant check as the previous step already wipes out template dir
        // but check anyway to be certain
        shouldExtract = templatePackageJson.version !== templateInfo.version;
      } else {
        shouldExtract = true;
      }

      if (shouldExtract) {
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
