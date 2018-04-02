/* eslint-disable no-console */
const builder = require('electron-builder');

const { Platform, Arch } = builder;

console.log(`Machine: ${process.platform}`);

const targets = process.platform === 'darwin' ?
  Platform.MAC.createTarget() : Platform.WINDOWS.createTarget(['nsis'], Arch.x64);

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
