/* eslint-disable no-console */

const builder = require('electron-builder');
const execFile = require('child_process').execFile;

const { Platform, Arch } = builder;

console.log(`Packaging for ${process.platform}`);

let targets;
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
    targets = Platform.WINDOWS.createTarget(['squirrel', 'nsis'], Arch.x64);
  }
}

// construct excluded files
const files = [];
['darwin', 'linux', 'win32'].forEach((platform) => {
  if (platform !== process.platform) {
    files.push(`!plugins/${platform}/**/*`);
  }
});

// Promise is returned
builder.build({
  targets,
  devMetadata: {
    build: {
      appId: 'com.webcatalog.app',
      linux: {
        category: 'public.app-category.utilities',
      },
      mac: {
        category: 'public.app-category.utilities',
      },
      win: {
        publish: ['github'],
      },
      files,
      asar: true,
      asarUnpack: ['plugins/**'],
      afterPack: ({ appOutDir }) =>
        new Promise((resolve, reject) => {
          if (process.platform !== 'darwin') {
            resolve();
            return;
          }

          // Use alternative exec to allow launching multiple instance of WebCatalog
          const fakeExecPath = `${appOutDir}/WebCatalog.app/Contents/MacOS/WebCatalog`;
          const realExecPath = `${appOutDir}/WebCatalog.app/Contents/MacOS/WebCatalog_Real`;

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
        })
      ,
    },
  },
})
.then(() => {
  console.log('build successful');
})
.catch(console.log);
