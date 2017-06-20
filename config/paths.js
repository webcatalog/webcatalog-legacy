const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);


// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appBuild: resolveApp('app/www'),
  appPublic: resolveApp('src/renderer/public'),
  storeHtml: resolveApp('src/renderer/store/store.html'),
  shellHtml: resolveApp('src/renderer/shell/shell.html'),
  storeIndexJs: resolveApp('src/renderer/store/index.js'),
  shellIndexJs: resolveApp('src/renderer/shell/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: '',
  servedPath: './',
};
