/* eslint-disable no-console */
const builder = require('electron-builder');

const { Platform, Arch } = builder;

console.log(`Machine: ${process.platform}`);

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
  case 'linux':
  default: {
    targets = Platform.LINUX.createTarget(['snap'], Arch.x64);
  }
}

Promise.resolve()
  .then(() => {
    const opts = {
      targets,
      config: {
        appId: 'com.juli.app',
        directories: {
          buildResources: 'build-resources',
        },
        mac: {
          category: 'public.app-category.utilities',
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
