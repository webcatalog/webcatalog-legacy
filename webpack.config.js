const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const OUTPUT_DIR = path.resolve(__dirname, 'app/www');
const SOURCE_DIR = path.resolve(__dirname, 'src/ui');

/* eslint-disable no-console */
const common = {
  entry: {
    store: `${SOURCE_DIR}/store/index.js`,
    ssb: `${SOURCE_DIR}/ssb/index.js`,
  },
  devtool: 'source-map',
  output: {
    path: OUTPUT_DIR,
    filename: '[name].bundle.js',
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
  target: 'electron',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.VERSION': JSON.stringify(process.env.npm_package_version),
    }),
  ],
};

const config = (() => {
  const copyArr = [
    { from: `${SOURCE_DIR}/store/store.html` },
    { from: `${SOURCE_DIR}/ssb/ssb.html` },
    { from: `${SOURCE_DIR}/images`, to: `${OUTPUT_DIR}/images` },
    { from: 'node_modules/@blueprintjs/core/dist/blueprint.css', to: `${OUTPUT_DIR}/dist` },
    { from: 'node_modules/@blueprintjs/core/resources', to: `${OUTPUT_DIR}/resources` },
  ];

  switch (process.env.NODE_ENV) {
    case 'production':
      return merge(common, {
        plugins: [
          new CleanWebpackPlugin([OUTPUT_DIR]),
          new CopyWebpackPlugin(copyArr),
          new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
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
