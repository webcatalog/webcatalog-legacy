const builder = require('electron-builder');
const execFile = require('child_process').execFile;

/* eslint-disable no-console */

// Promise is returned
builder.build({
  targets: builder.Platform.MAC.createTarget(),
  devMetadata: {
    build: {
      appId: 'com.webcatalog.app',
      mac: {
        category: 'public.app-category.utilities',
      },
      asar: true,
      asarUnpack: ['plugins/**'],
      afterPack: ({ appOutDir }) => {
        // Use alternative exec to allow launching multiple instance of WebCatalog

        const fakeExecPath = `${appOutDir}/WebCatalog.app/Contents/MacOS/WebCatalog`;
        const realExecPath = `${appOutDir}/WebCatalog.app/Contents/MacOS/WebCatalog_Real`;

        return new Promise((resolve, reject) => {
          execFile('./build/generate_alt_exec.sh', [
            fakeExecPath,
            realExecPath,
          ], (err, stdout) => {
            console.log(err);
            console.log(stdout);

            if (err) {
              reject(err);
              return;
            }

            resolve();
          });
        });
      },
    },
  },
})
.then(() => {
  console.log('build successful');
})
.catch(console.log);
