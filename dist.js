/* eslint-disable no-console */
const fs = require('fs-extra');
const builder = require('electron-builder');

const { Platform } = builder;

console.log(`Machine: ${process.platform}`);

const PACKAGE_JSON_PATH = 'package.json';
const TEMPLATE_PACKAGE_JSON_PATH = 'template/package.json';
const TEMPLATE_JSON_PATH = 'dist/template.json';

const packageJson = fs.readJSONSync(PACKAGE_JSON_PATH);
const templatePackageJson = fs.readJSONSync(TEMPLATE_PACKAGE_JSON_PATH);

if (packageJson.templateVersion !== templatePackageJson.version) {
  console.log('templateVersion is not correctly updated.');
  process.exit(1);
}

fs.ensureFileSync(TEMPLATE_JSON_PATH);
fs.writeJSONSync(TEMPLATE_JSON_PATH, {
  version: templatePackageJson.version,
});

const opts = {
  targets: Platform.MAC.createTarget(),
  config: {
    appId: 'com.webcatalog.jordan',
    productName: 'WebCatalog',
    asar: false,
    files: [
      'default-icon.png',
      'template.tar.gz',
      '!tests/**/*',
      '!docs/**/*',
      '!catalog/**/*',
      '!template/**/*',
    ],
    directories: {
      buildResources: 'build-resources',
    },
    mac: {
      category: 'public.app-category.utilities',
    },
    afterAllArtifactBuild: () => [TEMPLATE_JSON_PATH],
  },
};

builder.build(opts)
  .then(() => {
    console.log('build successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
