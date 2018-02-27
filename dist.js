/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
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

    // const asarUnpack = [
    // ...asarUnpackedMainDependencies.map(name => `node_modules/${name}/**/*`),
    // 'build/libs/install-app-async/script.js',
    // ];

    // console.log('Unpack these files from asar: ');
    // asarUnpack.forEach(name => console.log(name));

    const opts = {
      targets,
      config: {
        appId: 'com.webcatalog.resurrected',
        // asar: true,
        asar: false,
        // asarUnpack,
        files: [
          '!docs/**/*',
          '!tests/**/*',
        ],
        directories: {
          buildResources: 'build-resources',
        },
        mac: {
          category: 'public.app-category.utilities',
          extendInfo: {
            CFBundleURLTypes: [
              {
                CFBundleURLName: 'com.webcatalog.app.launch',
                CFBundleURLSchemes: [
                  'webcatalog',
                ],
              },
            ],
          },
        },
        dmg: {
          icon: 'build-resources/installerIcon.icns',
          background: 'build-resources/background.tiff',
          iconSize: 100,
          contents: [
            {
              x: 164,
              y: 182,
            },
            {
              x: 383,
              y: 182,
              type: 'link',
              path: '/Applications',
            },
          ],
          window: {
            x: 550,
            y: 315,
          },
        },
        afterPack: ({ appOutDir }) => {
          console.log('appOutDir:', appOutDir);

          const resourcesAppPath = process.platform === 'darwin'
            ? path.join(
              appOutDir,
              'WebCatalog.app',
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
            'node_modules', 'webcatalog-engine', 'app', 'node_modules',
          );

          const destNodeModulesPath = path.join(
            resourcesAppPath,
            'node_modules',
            'webcatalog-engine', 'app', 'node_modules',
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
            .then(() => fs.readdir(widevineLibDir))
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
