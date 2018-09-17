/* eslint-disable no-console */
const builder = require('electron-builder');

const { Arch, Platform } = builder;

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
    } else {
      switch (process.platform) {
        case 'darwin': {
          targets = Platform.MAC.createTarget(['dir']);
          break;
        }
        case 'win32': {
          targets = Platform.WINDOWS.createTarget(['dir'], Arch.x64);
          break;
        }
        default:
        case 'linux': {
          targets = Platform.LINUX.createTarget(['dir'], Arch.x64);
          break;
        }
      }
    }


    const opts = {
      targets,
      config: {
        appId: 'com.webcatalog.lite',
        productName: 'WebCatalog',
        asar: true,
        asarUnpack: ['default-icon.png'],
        files: [
          '!tests/**/*',
          '!docs/**/*',
          '!directory/**/*',
        ],
        directories: {
          buildResources: 'build-resources',
        },
        mac: {
          category: 'public.app-category.utilities',
        },
        linux: {
          category: 'Utility',
          packageCategory: 'utils',
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
