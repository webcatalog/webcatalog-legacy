/* eslint-disable no-console */

// Modify the code hackily :(
const path = require('path');
const replace = require('replace-in-file');

// electron-builder
// Keep electron-packager
replace({
  files: path.join(__dirname, 'node_modules', 'electron-builder-lib', 'out', 'util', 'packageDependencies.js'),
  from: '"electron-builder-tslint-config", "electron-download", "electron-forge", "electron-packager", "electron-compilers", "prebuild-install", "nan", "electron-webpack", "electron-webpack-ts", "electron-webpack-vue", "@types"',
  to: '"electron-builder-tslint-config", "electron-forge", "electron-compilers", "prebuild-install", "nan", "electron-webpack", "electron-webpack-ts", "electron-webpack-vue", "@types"',
})
  .then((changedFiles) => {
    console.log('Modified files:', changedFiles.join(', '));
  })
  .catch((error) => {
    console.error('Error occurred:', error);
  });
