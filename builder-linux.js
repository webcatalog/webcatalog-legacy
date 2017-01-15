const builder = require('electron-builder');

const { Platform, Arch } = builder;

/* eslint-disable no-console */

// Promise is returned
builder.build({
  targets: Platform.LINUX.createTarget(['deb', 'rpm'], Arch.x64),
  devMetadata: {
    build: {
      appId: 'com.webcatalog.app',
      linux: {
        category: 'public.app-category.utilities',
      },
      files: ['!plugins/darwin/**/*', '!plugins/win32/**/*'],
      asar: true,
      asarUnpack: ['plugins/**'],
    },
  },
})
.then(() => {
  console.log('build successful');
})
.catch(console.log);
