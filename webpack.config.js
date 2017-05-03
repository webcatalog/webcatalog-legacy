const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const OUTPUT_DIR = path.resolve(__dirname, 'app/www');
const SOURCE_DIR = path.resolve(__dirname, 'src/renderer');

/* eslint-disable no-console */
const common = {
  entry: {
    store: `${SOURCE_DIR}/store/index.js`,
    shell: `${SOURCE_DIR}/shell/index.js`,
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
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.(jpg|gif|png|svg|woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: {
          loader: 'file-loader',
          query: {
            name: 'fonts/[name].[ext]',
          },
        },
      },
    ],
  },
  target: 'electron-renderer',
  plugins: [
    new ExtractTextPlugin({
      filename: 'main.css',
      allChunks: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.VERSION': JSON.stringify(process.env.npm_package_version),
      'process.env.ALGOLIASEARCH_API_KEY_SEARCH': JSON.stringify(process.env.ALGOLIASEARCH_API_KEY_SEARCH),
      'process.env.ALGOLIASEARCH_APPLICATION_ID': JSON.stringify(process.env.ALGOLIASEARCH_APPLICATION_ID),
      'process.env.ALGOLIASEARCH_INDEX_NAME': JSON.stringify(process.env.ALGOLIASEARCH_INDEX_NAME),
    }),
  ],
};

const config = (() => {
  const copyArr = [
    { from: `${SOURCE_DIR}/store/store.html` },
    { from: `${SOURCE_DIR}/shell/shell.html` },
    { from: `${SOURCE_DIR}/images`, to: `${OUTPUT_DIR}/images` },
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
