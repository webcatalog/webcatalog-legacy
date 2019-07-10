# Appifier [![npm version](https://badge.fury.io/js/appifier.svg)](https://badge.fury.io/js/appifier) [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![Travis Build Status](https://travis-ci.org/webcatalog/appifier.svg?branch=master)](https://travis-ci.org/webcatalog/appifier)

**Appifier** is an Node.js library/CLI which turns any website into Electron app.

> WebCatalog no longer uses this library under the hood.

> Git history prior to April 2018 is squashed. You can still find it [here](https://github.com/webcatalog/appifier/tree/feb-26-full-history) & [here](https://github.com/webcatalog/appifier/tree/v11.1.0).

## Requirements
- macOS 10.9+, Windows 7+ or Linux.
- Node.js 8+.
- Yarn

## Usage
To create a native desktop app for [duckduckgo.com](https://duckduckgo.com):

### Command Line
Install: `npm install appifier -g` or `yarn global add appifier`

```bash
appifier --id duckduckgo --name "DuckDuckGo" --url "https://duckduckgo.com" --icon ./icon.png
```

### Programmatic API
Install: `npm install appifier` or `yarn add appifier`

```js
const appifier = require('appifier');

appifier.createAppAsync(
  'duckduckgo',
  'DuckDuckGo',
  'https://duckduckgo.com',
  path.resolve(__dirname, 'test', 'icon.png'),
  path.resolve(__dirname, 'dist'),
)
  .then((destPath) => {
    console.log(`App has been created at ${destPath}`);
  })
  .then((err) => {
    console.log(err);
  });
```

---

## How It Works
A template Electron app is included in the `./app` folder. When the `appifier` command or programmatic API is executed, this folder is copied to a temporary directory with the appropriate parameters in a configuration file, and is packaged into an app with [electron-packager](https://github.com/electron-userland/electron-packager).

---

## API Documentation
See [API](API.md).

---

## Development
See [DEVELOPMENT](DEVELOPMENT.md).
