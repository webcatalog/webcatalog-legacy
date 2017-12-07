/* eslint-disable no-console */


// Well, sometimes, to make the app works, we need to do this.
// Modify the code hackily :(
const path = require('path');
const replace = require('replace-in-file');
const fs = require('fs-extra');
const rebuild = require('electron-rebuild').default;

// electron-builder
// Keep electron-packager
replace({
  files: path.join(__dirname, 'node_modules', 'electron-builder-lib', 'out', 'util', 'packageDependencies.js'),
  from: '"electron-builder-tslint-config", "electron-download", "electron-forge", "electron-packager", "electron-compilers", "jest", "jest-cli", "prebuild-install", "nan", "electron-webpack", "electron-webpack-ts", "electron-webpack-vue", "react-scripts"',
  to: '"electron-builder-tslint-config", "electron-forge", "electron-compilers", "jest", "jest-cli", "prebuild-install", "nan", "electron-webpack", "electron-webpack-ts", "electron-webpack-vue", "react-scripts"',
})
  .then((changedFiles) => {
    console.log('Modified files:', changedFiles.join(', '));
  })
  .catch((error) => {
    console.error('Error occurred:', error);
  });

// electron-rebuild
console.log('Rebuild native dependencies at node_modules/@webcatalog/molecule/app');
const buildPath = path.join(__dirname, 'node_modules', '@webcatalog', 'molecule', 'app');
const packageJsonPath = path.join(buildPath, 'package.json');

fs.readJson(packageJsonPath)
  .then(({ dependencies }) => {
    const electronVersion = dependencies.electron;

    const opts = {
      buildPath,
      electronVersion,
    };

    console.log(opts);

    return rebuild(opts);
  })
  .then(() => console.info('Rebuild Successful'))
  .catch((e) => {
    console.error("Building modules didn't work!");
    console.error(e);
  });
