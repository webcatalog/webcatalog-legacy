/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-console */
const builder = require('electron-builder');
const { notarize } = require('electron-notarize');

const { Arch, Platform } = builder;

const { exec } = require('child_process');

// sometimes, notarization works but *.app does not have a ticket stapled to it
// this ensure the *.app has the notarization ticket
const verifyNotarizationAsync = (filePath) => new Promise((resolve, reject) => {
  // eslint-disable-next-line no-console
  console.log(`xcrun stapler validate ${filePath.replace(/ /g, '\\ ')}`);

  exec(`xcrun stapler validate ${filePath.replace(/ /g, '\\ ')}`, (e, stdout, stderr) => {
    if (e instanceof Error) {
      reject(e);
      return;
    }

    if (stderr) {
      reject(new Error(stderr));
      return;
    }

    if (stdout.indexOf('The validate action worked!') > -1) {
      resolve(stdout);
    } else {
      reject(new Error(stdout));
    }
  });
});

// run each signing task at once
let codeSigningPromise = Promise.resolve();
const hsmCodeSignAsync = (filePath) => {
  codeSigningPromise = codeSigningPromise
    .then(() => new Promise((resolve, reject) => {
      const {
        AZURE_KEY_VAULT_CLIENT_ID,
        AZURE_KEY_VAULT_CLIENT_SECRET,
        AZURE_KEY_VAULT_URI,
        AZURE_KEY_VAULT_CERT_NAME,
      } = process.env;

      console.log('Signing', filePath);
      const command = `azuresigntool sign -kvu ${AZURE_KEY_VAULT_URI} -kvc ${AZURE_KEY_VAULT_CERT_NAME} -kvi ${AZURE_KEY_VAULT_CLIENT_ID} -kvs ${AZURE_KEY_VAULT_CLIENT_SECRET} -tr http://rfc3161timestamp.globalsign.com/advanced -td sha256 '${configuration.path}'`;
      exec(command, { shell: 'powershell.exe' }, (e, stdout, stderr) => {
        if (e instanceof Error) {
          console.log(stdout);
          reject(e);
          return;
        }

        if (stderr) {
          reject(new Error(stderr));
          return;
        }

        if (stdout.indexOf('Signing completed successfully') > -1) {
          resolve(stdout);
        } else {
          reject(new Error(stdout));
        }
      });
    }));
  return codeSigningPromise;
};

const arch = process.env.TEMPLATE_ARCH || 'x64';

if ((['x64', 'arm64'].indexOf(arch) < 0)) {
  console.log(`${process.platform} ${arch} is not supported.`);
}

console.log(`Building for: ${process.platform} ${process.platform === 'darwin' ? 'x64+arm64' : arch}`);

let targets;
switch (process.platform) {
  case 'darwin': {
    targets = Platform.MAC.createTarget(['zip', 'dmg'], Arch.x64, Arch.arm64);
    break;
  }
  case 'win32': {
    targets = Platform.WINDOWS.createTarget(['nsis'], Arch[arch]);
    break;
  }
  default:
  case 'linux': {
    targets = Platform.LINUX.createTarget(['AppImage', 'tar.gz'], Arch[arch]);
    break;
  }
}

const opts = {
  targets,
  config: {
    appId: 'com.webcatalog.jordan',
    productName: 'WebCatalog',
    asar: true,
    asarUnpack: [
      'default-app-icons/**/*',
      '**/node_modules/regedit/**/*',
      '**/rcedit*.exe',
      '**/build/vbs/**/*',
      '**/build/**/Shortcut.exe',
      '**/build/**/*forked*',
    ],
    files: [
      'bin/**/*',
      'default-app-icons/**/*',
      '!tests/**/*',
      '!docs/**/*',
      '!catalog/**/*',
      '!template/**/*',
      // phantomjs binary is up to 50Mb but unused. Remove to bring down app size
      '!node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs',
      '!node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs.exe',
      // heavy demo files
      '!node_modules/image-q/demo/**/*',
    ],
    directories: {
      buildResources: 'build-resources',
    },
    protocols: {
      name: 'WebCatalog',
      schemes: ['webcatalog'],
    },
    win: {
      // https://www.electron.build/configuration/win.html#how-do-delegate-code-signing
      sign: (configuration) => hsmCodeSignAsync(configuration.path),
    },
    mac: {
      category: 'public.app-category.utilities',
      hardenedRuntime: true,
      gatekeeperAssess: false,
      darkModeSupport: true,
      entitlements: 'build-resources/entitlements.mac.plist',
      entitlementsInherit: 'build-resources/entitlements.mac.plist',
      requirements: 'build-resources/electron-builder-requirements.txt',
    },
    linux: {
      category: 'Utility',
      packageCategory: 'utils',
    },
    nsis: arch === 'arm64' ? {
      // eslint-disable-next-line no-template-curly-in-string
      artifactName: 'WebCatalog-Setup-${version}-arm64.${ext}',
    } : undefined,
    afterSign: (context) => {
      // Only notarize app when forced in pull requests or when releasing using tag
      const shouldNotarize = process.platform === 'darwin' && context.electronPlatformName === 'darwin' && process.env.CI_BUILD_TAG;
      if (!shouldNotarize) return null;

      console.log('Notarizing app...');
      // https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
      const { appOutDir } = context;

      const appName = context.packager.appInfo.productFilename;
      const appPath = `${appOutDir}/${appName}.app`;

      return notarize({
        appBundleId: 'com.webcatalog.jordan',
        appPath,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASSWORD,
      })
        .then(() => verifyNotarizationAsync(appPath))
        .then((notarizedInfo) => {
          // eslint-disable-next-line no-console
          console.log(notarizedInfo);
        });
    },
  },
};

Promise.resolve()
  .then(() => builder.build(opts))
  .then(() => {
    console.log('build successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
