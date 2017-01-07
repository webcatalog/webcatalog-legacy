const builder = require('electron-builder');
const execFile = require('child_process').execFile;

/* eslint-disable no-console */

// Promise is returned
builder.build({
  targets: builder.Platform.WINDOWS.createTarget(['squirrel', 'nsis']),
  devMetadata: {
    build: {
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
