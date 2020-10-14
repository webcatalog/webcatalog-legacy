// bundle forked scripts with webpack
// as in production, with asar, node_modules are not accessible in forked scripts

const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const plugins = [
  new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1,
  }),
];
if (process.platform === 'win32') {
  plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'node_modules', 'rcedit', 'bin', 'rcedit-x64.exe'),
          to: path.join(__dirname, 'build', 'libs', 'app-management', 'bin', 'rcedit-x64.exe'),
        },
      ],
    }),
  );
}

// https://jlongster.com/Backend-Apps-with-Webpack--Part-I
module.exports = {
  mode: 'production',
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
  entry: {
    'libs/app-management/install-app-async/forked-script-electron-v2.js': path.join(__dirname, 'public', 'libs', 'app-management', 'install-app-async', 'forked-script-electron-v2.js'),
    'libs/app-management/install-app-async/forked-script-lite-v1.js': path.join(__dirname, 'public', 'libs', 'app-management', 'install-app-async', 'forked-script-lite-v1.js'),
    'libs/app-management/install-app-async/forked-script-lite-v2.js': path.join(__dirname, 'public', 'libs', 'app-management', 'install-app-async', 'forked-script-lite-v2.js'),
    'libs/app-management/prepare-template-async/forked-script.js': path.join(__dirname, 'public', 'libs', 'app-management', 'prepare-template-async', 'forked-script.js'),
    'libs/app-management/uninstall-app-async/forked-script.js': path.join(__dirname, 'public', 'libs', 'app-management', 'uninstall-app-async', 'forked-script.js'),
  },
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name]',
  },
  devtool: 'source-map',
  plugins,
};
