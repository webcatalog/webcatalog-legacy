# appifier [![npm package](https://img.shields.io/npm/v/@webcatalog/appifier.svg)](https://www.npmjs.org/package/@webcatalog/appifier)

| Linux | macOS | Windows |
| ----- | ----- | ------- |
| [![CircleCI](https://circleci.com/gh/webcatalog/appifier.svg?style=svg&circle-token=f2513ee30140f077d85b0c269d1d9ce36464f015)](https://circleci.com/gh/webcatalog/appifier) | [![Travis Build Status](https://travis-ci.org/webcatalog/appifier.svg?branch=master)](https://travis-ci.org/webcatalog/appifier) | [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/webcatalog/appifier?branch=master&svg=true)](https://ci.appveyor.com/project/webcatalog/appifier/branch/master) |

**appifier** is a Node.js library/CLI which turns any web site into native app.

It is what [WebCatalog](https://github.com/webcatalog/webcatalog) uses under the hood. In other words, [WebCatalog](https://github.com/webcatalog/webcatalog) acts as GUI for **appifier** (with some additional optimizations like [resource sharing](https://github.com/webcatalog/webcatalog/issues/171)).

It works similarly to [nativefier](https://github.com/jiahaog/Nativefier) but is designed with a more consumer-friendly mindset.

![Facebook Messenger app for macOS, created with appifier](/screenshot.png)

## Installation
##### Requirements
- macOS 10.9+ / Windows / Linux
- [Node.js](https://nodejs.org/) `>=8`

`yarn global add appifier` or `npm install appifier -g`

## Usage
Creating a native desktop app for [duckduckgo.com](https://duckduckgo.com):

### Command Line
```bash
nativefier --name "DuckDuckGo" --url "https://duckduckgo.com" --icon ./icon.png
```

### Programmatic API
```js
const appifier = require('appifier');

appifier.createAppAsync(
  'duckduckgo',
  'DuckDuckGo',
  'https://duckduckgo.com',
  path.resolve(__dirname, 'test', 'icon.png'),
  path.resolve(__dirname, 'dist'),
)
  .then(() => console.log('ok'))
  .then(err => console.log(err));
```

### Notes
Read the [API documentation](API.md) for other command line flags and options which can be used to configure the packaged app. Still, it is not really necessary as you can modify the options later using the GUI inside the generated app.

## How It Works
A template Electron app is included in the `./app` folder. When the `appifier` command is executed, this folder is copied to a temporary directory with the appropriate parameters in a configuration file, and is packaged into an app with [electron-packager](https://github.com/electron-userland/electron-packager).

## API Documentation
See [API](API.md).

## Development
See [DEVELOPMENT.md](DEVELOPMENT.md)
