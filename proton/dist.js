/* eslint-disable no-console */
const builder = require('electron-builder');

const { Platform, Arch } = builder;

console.log(`Machine: ${process.platform}`);

Promise.resolve()
  .then(() => {
    let targets;

    if (process.env.NODE_ENV === 'production') {
      switch (process.platform) {
        case 'darwin': {
          targets = Platform.MAC.createTarget();
          break;
        }
        case 'linux': {
          targets = Platform.LINUX.createTarget(['AppImage'], Arch.x64);
          break;
        }
        case 'win32':
        default: {
          targets = Platform.WINDOWS.createTarget(['nsis'], Arch.x64);
        }
      }
    } else {
      switch (process.platform) {
        case 'darwin': {
          targets = Platform.MAC.createTarget(['dir']);
          break;
        }
        case 'linux': {
          targets = Platform.LINUX.createTarget(['dir'], Arch.x64);
          break;
        }
        case 'win32':
        default: {
          targets = Platform.WINDOWS.createTarget(['dir'], Arch.x64);
        }
      }
    }

    // const asarUnpack = [
    // ...asarUnpackedMainDependencies.map(name => `node_modules/${name}/**/*`),
    // 'build/libs/install-app-async/script.js',
    // ];

    // console.log('Unpack these files from asar: ');
    // asarUnpack.forEach(name => console.log(name));

    const opts = {
      targets,
      config: {
        appId: 'com.webcatalog.app',
        // asar: true,
        asar: false,
        // asarUnpack,
        directories: {
          buildResources: 'build-resources',
        },
        linux: {
          category: 'Utilities',
          packageCategory: 'utils',
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
      },
    };

    return builder.build(opts);
  })
  .then(() => {
    console.log('build successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
