const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'app/www');
const APP_DIR = path.resolve(__dirname, 'src');

/* eslint-disable no-console */

const common = {
  entry: `${APP_DIR}/index.js`,
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    chunkFilename: '[id].js',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: ['babel-loader'],
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.VERSION': JSON.stringify(process.env.npm_package_version),
    }),
  ],
};

const config = (() => {
  const copyArr = [
    { from: 'src/index.html' },
    { from: 'src/images', to: `${BUILD_DIR}/images` },
    { from: 'node_modules/@blueprintjs/core/dist/blueprint.css', to: `${BUILD_DIR}/dist` },
    { from: 'node_modules/@blueprintjs/core/resources', to: `${BUILD_DIR}/resources` },
  ];

  switch (process.env.NODE_ENV) {
    case 'production':
      return merge(common, {
        plugins: [
          new CleanWebpackPlugin([BUILD_DIR]),
          new CopyWebpackPlugin(copyArr),
          new webpack.optimize.UglifyJsPlugin(),
          new webpack.optimize.AggressiveMergingPlugin(),
        ],
      });
    case 'development':
    default:
      return merge(common, {
        plugins: [
          new CopyWebpackPlugin(copyArr),
          new webpack.HotModuleReplacementPlugin({
            multiStep: true,
          }),
        ],
      });
  }
})();

module.exports = config;
