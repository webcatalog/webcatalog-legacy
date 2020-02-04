/* eslint-disable no-console */
const fs = require('fs-extra');
const builder = require('electron-builder');
const { notarize } = require('electron-notarize');

const { Arch, Platform } = builder;

console.log(`Machine: ${process.platform}`);

const PACKAGE_JSON_PATH = 'package.json';
const TEMPLATE_PACKAGE_JSON_PATH = 'template/package.json';
const TEMPLATE_JSON_PATH = 'dist/template.json';
const TEMPLATE_ZIP_PATH = 'template.zip';

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

let targets;
switch (process.platform) {
  case 'darwin': {
    targets = Platform.MAC.createTarget();
    break;
  }
  case 'win32': {
    targets = Platform.WINDOWS.createTarget(['nsis'], Arch.x64);
    break;
  }
  default:
  case 'linux': {
    targets = Platform.LINUX.createTarget(['AppImage'], Arch.x64);
    break;
  }
}

const opts = {
  targets,
  config: {
    appId: 'com.webcatalog.jordan',
    productName: 'WebCatalog',
    asar: false,
    files: [
      'default-icon.png',
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
      darkModeSupport: true,
      entitlements: 'build-resources/entitlements.mac.plist',
      entitlementsInherit: 'build-resources/entitlements.mac.plist',
    },
    linux: {
      category: 'Utility',
      packageCategory: 'utils',
    },
    afterAllArtifactBuild: () => [TEMPLATE_JSON_PATH, TEMPLATE_ZIP_PATH],
    afterSign: (context) => {
      // Only notarize app when forced in pull requests or when releasing using tag
      const shouldNotarize = process.platform === 'darwin' && context.electronPlatformName === 'darwin' && process.env.CI_BUILD_TAG;
      if (!shouldNotarize) return null;

      console.log('Notarizing app...');
      // https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
      const { appOutDir } = context;

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
