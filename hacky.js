// Well, sometimes, to make the app works, we need to do this.
// Modify the code hackily :(
const path = require('path');
const replace = require('replace-in-file');

console.log(path.join(__dirname, 'node_modules', '@webcatalog', 'molecule', 'lib', 'index.js'));

// @webcatalog/molecule
// Use /app in unpacked asar folder.
replace({
  files: path.join(__dirname, 'node_modules', '@webcatalog', 'molecule', 'lib', 'index.js'),
  from: "path.resolve(__dirname, '..', 'app');",
  to: "path.resolve(__dirname, '..', 'app').replace('app.asar', 'app.asar.unpacked');",
})
  .then(changedFiles => {
    console.log('Modified files:', changedFiles.join(', '));
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });

// electron-builder
// Keep electron-packager
replace({
  files: path.join(__dirname, 'node_modules', 'electron-builder', 'out', 'util', 'packageDependencies.js'),
  from: '"electron-builder-tslint-config", "electron-download", "electron-forge", "electron-packager", "electron-compilers", "jest", "jest-cli", "prebuild-install", "nan", "asar-integrity", "asar", "electron-webpack", "electron-webpack-ts", "electron-webpack-vue", "react-scripts"',
  to: '"electron-builder-tslint-config", "electron-forge", "electron-compilers", "jest", "jest-cli", "prebuild-install", "nan", "electron-webpack", "electron-webpack-ts", "electron-webpack-vue", "react-scripts"',
})
  .then(changedFiles => {
    console.log('Modified files:', changedFiles.join(', '));
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
