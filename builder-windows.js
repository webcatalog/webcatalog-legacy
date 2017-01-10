const builder = require('electron-builder');

const { Platform, Arch } = builder;

/* eslint-disable no-console */

// Promise is returned
builder.build({
  targets: Platform.WINDOWS.createTarget(['squirrel', 'nsis'], Arch.x64, Arch.ia32),
  devMetadata: {
    build: {
      win: {
        publish: ['github'],
      },
      files: ['!plugins/darwin/**/*'],
      appId: 'com.webcatalog.app',
      asar: true,
      asarUnpack: ['plugins/**'],
    },
  },
})
.then(() => {
  console.log('build successful');
})
.catch(console.log);
