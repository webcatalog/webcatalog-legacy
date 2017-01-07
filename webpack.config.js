const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'app/www');
const APP_DIR = path.resolve(__dirname, 'src');

/* eslint-disable no-console */

console.log(process.env.NODE_ENV);

const common = {
  entry: `${APP_DIR}/index.js`,
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    chunkFilename: '[id].js',
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        include: APP_DIR,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
        },
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
          new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
            },
            output: {
              comments: false,
            },
          }),
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
