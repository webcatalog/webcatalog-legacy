/* eslint-disable no-console */

const builder = require('electron-builder');
const path = require('path');
const fs = require('fs-extra');

const { Platform, Arch } = builder;

console.log(`Machine: ${process.platform}`);

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

if (process.platform === 'linux') process.exit(0);

const opts = {
  targets,
  config: {
    appId: 'com.webcatalog.app',
    asar: false,
    asarUnpack: [
      'node_modules/electron-packager/**/*',
      'node_modules/@webcatalog/molecule/app/**/*',
      'build/libs/installAppAsync/script.js',
    ],
    directories: {
      buildResources: 'build-resources',
    },
    linux: {
      category: 'Utilities',
      packageCategory: 'utils',
      target: [
        'deb',
        'rpm',
        'pacman',
      ],
    },
    mac: {
      category: 'public.app-category.utilities',
      extendInfo: {
        CFBundleURLTypes: [
          {
            CFBundleURLName: 'com.webcatalog.app.launch',
            CFBundleURLSchemes: [
              'webcatalog',
            ],
          },
        ],
      },
    },
    dmg: {
      icon: 'build-resources/installerIcon.icns',
      background: 'build-resources/background.tiff',
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
    afterPack: ({ appOutDir }) => {
      const sourcePath = path.join(__dirname, 'node_modules', '@webcatalog', 'molecule', 'app', 'node_modules');
      const destPath = path.join(appOutDir, 'WebCatalog.app', 'Contents',
        'Resources', 'app', 'node_modules',
        '@webcatalog', 'molecule', 'app', 'node_modules');

      console.log(`Copying ${sourcePath} to ${destPath}...`);

      return fs.copy(sourcePath, destPath);
    },
  },
};

// Promise is returned
builder.build(opts)
  .then(() => {
    console.log('build successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
