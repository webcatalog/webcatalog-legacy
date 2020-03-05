const argv = require('yargs-parser')(process.argv.slice(1));
const decompress = require('decompress');
const download = require('download');
const fs = require('fs-extra');
const path = require('path');
const tmp = require('tmp');

const customizedFetch = require('../../customized-fetch');

const {
  appVersion,
  templatePath,
  platform,
  arch,
} = argv;

const fetchLatestTemplateVersionAsync = () => customizedFetch(`https://github.com/quanglam2807/webcatalog/releases/download/v${appVersion}/template.json`)
  .then((res) => res.json())
  .then((fetchedJson) => ({
    templateVersion: fetchedJson.version,
    templateZipUrl: `https://github.com/quanglam2807/webcatalog/releases/download/v${appVersion}/template-${platform}-${arch}.zip`,
  }));

fetchLatestTemplateVersionAsync()
  .then((latest) => {
    let shouldDownload = false;
    const templateJsonPath = path.join(templatePath, 'package.json');
    if (fs.pathExistsSync(templateJsonPath)) {
      const templatePackageJson = fs.readJsonSync(templateJsonPath);
      if (templatePackageJson.version !== latest.templateVersion) {
        shouldDownload = true;
      }
    } else {
      shouldDownload = true;
    }

    if (shouldDownload) {
      // local template is outdated
      // download new template
      const tmpPath = tmp.dirSync().name;
      const templateZipName = 'template.zip';
      const templateZipPath = path.join(tmpPath, templateZipName);
      return fs.remove(templatePath)
        .then(() => console.log(`Downloading template code to ${templateZipPath}...`)) // eslint-disable-line no-console
        .then(() => download(latest.templateZipUrl, tmpPath, {
          filename: templateZipName,
        }))
        .then(() => console.log(`Extracting template code to ${templatePath}...`)) // eslint-disable-line no-console
        .then(() => decompress(templateZipPath, templatePath));
    }
    return null;
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
