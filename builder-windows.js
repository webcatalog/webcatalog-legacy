const builder = require('electron-builder');

/* eslint-disable no-console */

// Promise is returned
builder.build({
  targets: builder.Platform.WINDOWS.createTarget(['squirrel', 'nsis']),
  devMetadata: {
    build: {
      win: {
        publish: ['github'],
      },
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
