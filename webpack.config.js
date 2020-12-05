/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
// bundle forked scripts with webpack
// as in production, with asar, node_modules are not accessible in forked scripts

const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const getForkedScriptsConfig = () => {
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
  return {
    mode: 'production',
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
    entry: {
      'install-app-async-electron-v2': path.join(__dirname, 'public', 'libs', 'app-management', 'install-app-async', 'install-app-async-electron-v2.js'),
      'install-app-async-lite-v1': path.join(__dirname, 'public', 'libs', 'app-management', 'install-app-async', 'install-app-async-lite-v1.js'),
      'install-app-async-lite-v2': path.join(__dirname, 'public', 'libs', 'app-management', 'install-app-async', 'install-app-async-lite-v2.js'),
      'prepare-engine-async': path.join(__dirname, 'public', 'libs', 'app-management', 'prepare-engine-async', 'prepare-engine-async.js'),
      'prepare-electron-async': path.join(__dirname, 'public', 'libs', 'app-management', 'prepare-electron-async', 'prepare-electron-async.js'),
      'uninstall-app-async': path.join(__dirname, 'public', 'libs', 'app-management', 'uninstall-app-async', 'uninstall-app-async.js'),
    },
    target: 'node',
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js',
    },
    devtool: 'source-map',
    plugins,
  };
};

const getElectronScriptsConfig = () => {
  const plugins = [];
  return {
    mode: 'production',
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
    entry: {
      // eslint-disable-next-line quote-props
      'electron': path.join(__dirname, 'public', 'electron.js'),
      'preload-main': path.join(__dirname, 'public', 'libs', 'windows', 'preload-main.js'),
      'preload-menubar': path.join(__dirname, 'public', 'libs', 'windows', 'preload-menubar.js'),
    },
    target: 'electron-main',
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js',
    },
    devtool: 'source-map',
    plugins,
  };
};

module.exports = [getForkedScriptsConfig(), getElectronScriptsConfig()];
