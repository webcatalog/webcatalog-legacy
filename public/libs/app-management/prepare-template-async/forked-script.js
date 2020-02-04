const argv = require('yargs-parser')(process.argv.slice(1));
const decompress = require('decompress');
const download = require('download');
const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');
const tmp = require('tmp');

const {
  appVersion,
  templatePath,
  platform,
  arch,
} = argv;

const fetchLatestTemplateVersionAsync = () => fetch(`https://github.com/quanglam2807/webcatalog/releases/download/v${appVersion}/template.json`)
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
        .then(() => download(latest.templateZipUrl, tmpPath, {
          filename: templateZipName,
        }))
        .then(() => decompress(templateZipPath, templatePath, {
          map: (file) => {
            if (file.path.startsWith('template/')) {
              return Object.assign(file, {
                path: file.path.replace('template/', ''),
              });
            }
            return file;
          },
        }));
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
