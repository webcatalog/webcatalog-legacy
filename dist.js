/* eslint-disable no-console */
const builder = require('electron-builder');

const { Platform } = builder;

console.log(`Machine: ${process.platform}`);

Promise.resolve()
  .then(() => {
    let targets;

    if (process.env.NODE_ENV === 'production') {
      targets = Platform.MAC.createTarget();
    } else {
      targets = Platform.MAC.createTarget(['dir']);
    }

    const opts = {
      targets,
      config: {
        appId: 'com.webcatalog.lite',
        productName: 'WebCatalog Lite',
        asar: true,
        files: [
          '!tests/**/*',
        ],
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
