/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const builder = require('electron-builder');

const { Platform, Arch } = builder;

console.log(`Machine: ${process.platform}`);

Promise.resolve()
  .then(() => {
    let targets;

    if (process.env.NODE_ENV === 'production') {
      switch (process.platform) {
        case 'darwin': {
          targets = Platform.MAC.createTarget(['zip']);
          break;
        }
        case 'linux': {
          targets = Platform.LINUX.createTarget(['deb', 'rpm', 'pacman'], Arch.x64);
          break;
        }
        case 'win32':
        default: {
          targets = Platform.WINDOWS.createTarget(['nsis'], Arch.x64);
        }
      }
    } else {
      switch (process.platform) {
        case 'darwin': {
          targets = Platform.MAC.createTarget(['dir']);
          break;
        }
        case 'linux': {
          targets = Platform.LINUX.createTarget(['dir'], Arch.x64);
          break;
        }
        case 'win32':
        default: {
          targets = Platform.WINDOWS.createTarget(['dir'], Arch.x64);
        }
      }
    }

    // const asarUnpack = [
    // ...asarUnpackedMainDependencies.map(name => `node_modules/${name}/**/*`),
    // 'build/libs/install-app-async/script.js',
    // ];

    // console.log('Unpack these files from asar: ');
    // asarUnpack.forEach(name => console.log(name));

    const opts = {
      targets,
      config: {
        appId: 'com.appifier.app',
        asar: false,
        directories: {
          buildResources: 'build-resources',
        },
        linux: {
          category: 'Utility',
          packageCategory: 'utils',
        },
        mac: {
          category: 'public.app-category.utilities',
        },
        afterPack: ({ appOutDir }) => {
          console.log('appOutDir:', appOutDir);

          const resourcesAppPath = process.platform === 'darwin'
            ? path.join(
              appOutDir,
              'Appifier.app',
              'Contents',
              'Resources',
              'app',
            )
            : path.join(
              appOutDir,
              'resources',
              'app',
            );

          const sourceNodeModulesPath = path.join(
            __dirname,
            'node_modules', 'appifier', 'app', 'node_modules',
          );

          const destNodeModulesPath = path.join(
            resourcesAppPath,
            'node_modules',
            'appifier', 'app', 'node_modules',
          );

          const sourceElectronIconPath = path.join(
            __dirname,
            'electron-icon.png',
          );

          const destElectronIconPath = path.join(
            resourcesAppPath,
            'electron-icon.png',
          );


          const widevineLibDir = path.join(
            destNodeModulesPath,
            'electron-widevinecdm', 'widevine',
          );

          console.log('Copying additional files...');

          return fs.copy(sourceElectronIconPath, destElectronIconPath)
            .then(() => fs.copy(sourceNodeModulesPath, destNodeModulesPath))
            .then(() => {
              if (process.platform === 'win32') return null;

              return fs.readdir(widevineLibDir)
                .then((dirs) => {
                  const acceptedName = `${process.platform}_${process.arch}`;

                  const p = dirs.map((dir) => {
                    if (dir !== acceptedName) {
                      console.log(`Removing node_modules/electron-widevinecdm/widevine/${dir}`);
                      return fs.remove(path.join(widevineLibDir, dir));
                    }

                    return null;
                  });

                  return Promise.all(p);
                });
            });
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
