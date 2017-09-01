/* eslint-disable no-console */

const builder = require('electron-builder');
const execFile = require('child_process').execFile;
const electronVersion = require('./package.json').devDependencies.electron;

const { Platform, Arch } = builder;

console.log(`Packaging for ${process.platform}`);

let targets;
switch (process.platform) {
  case 'darwin': {
    targets = Platform.MAC.createTarget();
    break;
  }
  case 'linux': {
    targets = Platform.LINUX.createTarget(['deb', 'rpm', 'pacman'], Arch.x64);
    break;
  }
  case 'win32':
  default: {
    targets = Platform.WINDOWS.createTarget(['squirrel', 'nsis'], Arch.x64);
  }
}

// Promise is returned
builder.build({
  targets,
  publish: 'onTagOrDraft',
  config: {
    electronVersion,
    appId: 'com.webcatalog.app',
    files: [
      '!{scripts,src,website,tests,webpack.config.js}',
    ],
    asar: true,
    asarUnpack: [
      'app/www/images/custom_app.png',
      'node_modules/electron-widevinecdm',
    ],
    linux: {
      category: 'Utilities', // https://specifications.freedesktop.org/menu-spec/latest/apa.html#main-category-registry
      packageCategory: 'utils', // https://packages.debian.org/wheezy/utils/
    },
    mac: {
      category: 'public.app-category.utilities',
      extendInfo: {
        CFBundleURLTypes: [
          {
            CFBundleURLName: 'com.webcatalog.app.launch',
            CFBundleURLSchemes: ['webcatalog'],
          },
        ],
      },
    },
    dmg: {
      icon: 'build/installerIcon.icns',
      background: 'build/background.tiff',
      iconSize: 100,
      contents: [
        {
          x: 164,
          y: 182,
        },
        {
          x: 383,
          y: 182,
          type: 'link',
          path: '/Applications',
        },
      ],
      window: {
        x: 550,
        y: 315,
      },
    },
    afterPack: ({ appOutDir }) =>
      new Promise((resolve, reject) => {
        if (process.platform !== 'darwin') {
          resolve();
          return;
        }

        // Use alternative exec to allow launching multiple instance of WebCatalog
        // https://github.com/webcatalog/webcatalog/issues/10
        // Use this solution because it ensures notification will work.
        const fakeExecPath = `${appOutDir}/WebCatalog.app/Contents/MacOS/WebCatalog`;
        const realExecPath = `${appOutDir}/WebCatalog.app/Contents/MacOS/WebCatalog_Real`;

        execFile('./build/generate_alt_exec.sh', [
          fakeExecPath,
          realExecPath,
        ], (err, stdout) => {
          console.log(stdout);
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });
      }),
  },
})
.then(() => {
  console.log('build successful');
})
.catch((err) => {
  console.log(err);
  process.exit(1);
});
