/* eslint-disable no-console */

const builder = require('electron-builder');
const exec = require('child_process').exec;

const { Platform, Arch } = builder;

console.log(`Packaging for ${process.platform}`);

let targets;
switch (process.platform) {
  case 'darwin': {
    targets = Platform.MAC.createTarget();
    break;
  }
  case 'linux': {
    targets = Platform.LINUX.createTarget(['deb', 'rpm', 'pacman'], Arch.x64);
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
  publish: 'onTag',
  config: {
    appId: 'com.webcatalog.app',
    category: 'public.app-category.utilities',
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
        // https://github.com/webcatalog/desktop/issues/10
        const execPath = `${appOutDir}/WebCatalog.app/Contents/MacOS/WebCatalog`;
        const altExecPath = `${appOutDir}/WebCatalog.app/Contents/Resources/WebCatalog_Alt`;

        exec(`cp ${execPath} ${altExecPath}`, (err, stdout) => {
          console.log(stdout);
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });
      }),
  },
})
.then(() => {
  console.log('build successful');
})
.catch((err) => {
  console.log(err);
  process.exit(1);
});
