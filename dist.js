/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const builder = require('electron-builder');

const { Platform, Arch } = builder;

console.log(`Machine: ${process.platform}`);

/*
const getChildDependenciesAsync = (packageName) => {
  console.log(packageName);
  let deps = [];

  const dependencyPackageJsonPath =
    path.join(__dirname, 'node_modules', packageName, 'package.json');

  return fs.pathExists(dependencyPackageJsonPath)
    .then((exists) => {
      if (exists) {
        return fs.readJson(dependencyPackageJsonPath)
          .then(({ dependencies }) => {
            const p = [];

            if (dependencies) {
              deps = deps.concat(Object.keys(dependencies));

              Object.keys(dependencies).forEach(name =>
                p.push(getChildDependenciesAsync(name).then((d) => {
                  deps = deps.concat(d);
                })),
              );
            }

            return Promise.all(p);
          });
      }

      return null;
    })
    .then(() => deps);
};
*/

Promise.resolve()
  /*
  .then(() => {
    const asarUnpackedMainDependencies = [
      '@webcatalog/molecule',
      'follow-redirects',
      'fs-extra',
      'tmp',
      'yargs-parser',
      // for fs-extra
      'rimraf',
      'coveralls',
      'istanbul',
      'klaw',
      'klaw-sync',
      'minimist',
      'mocha',
      'proxyquire',
      'read-dir-files',
      'rimraf',
      'secure-random',
      'semver',
      'standard',
      'standard-markdown',
    ];
    let deps = asarUnpackedMainDependencies;

    const p = [];

    asarUnpackedMainDependencies.forEach((name) => {
      p.push(
        getChildDependenciesAsync(name).then((d) => {
          deps = deps.concat(d);
        }),
      );
    });

    return Promise.all(p).then(() =>
      deps.filter((elem, pos) => deps.indexOf(elem) === pos),
    );
  })
  */
  .then(() => {
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
        targets = Platform.WINDOWS.createTarget(['nsis'], Arch.x64);
      }
    }

    if (process.platform === 'linux') process.exit(0);

    // const asarUnpack = [
    // ...asarUnpackedMainDependencies.map(name => `node_modules/${name}/**/*`),
    // 'build/libs/install-app-async/script.js',
    // ];

    // console.log('Unpack these files from asar: ');
    // asarUnpack.forEach(name => console.log(name));

    const opts = {
      targets,
      config: {
        appId: 'com.webcatalog.app',
        // asar: true,
        asar: false,
        // asarUnpack,
        directories: {
          buildResources: 'build-resources',
        },
        linux: {
          category: 'Utilities',
          packageCategory: 'utils',
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
          const sourcePath = path.join(__dirname,
            'node_modules', '@webcatalog', 'molecule', 'app', 'node_modules');
          const destPath = path.join(appOutDir, 'WebCatalog.app', 'Contents',
            'Resources', 'app', 'node_modules',
            '@webcatalog', 'molecule', 'app', 'node_modules');

          console.log(`Copying ${sourcePath} to ${destPath}...`);

          return fs.copy(sourcePath, destPath);
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
