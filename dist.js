/* eslint-disable no-console */
const fs = require('fs-extra');
const builder = require('electron-builder');
const { notarize } = require('electron-notarize');

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
      'template.zip',
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
      hardenedRuntime: true,
      gatekeeperAssess: false,
      entitlements: 'build-resources/entitlements.mac.plist',
      entitlementsInherit: 'build-resources/entitlements.mac.plist',
    },
    afterAllArtifactBuild: () => [TEMPLATE_JSON_PATH],
    afterSign: (context) => {
      console.log('Notarizing app...');
      // https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
      const { electronPlatformName, appOutDir } = context;
      if (electronPlatformName !== 'darwin') {
        return null;
      }

      const appName = context.packager.appInfo.productFilename;

      return notarize({
        appBundleId: 'com.webcatalog.jordan',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASSWORD,
      });
    },
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
