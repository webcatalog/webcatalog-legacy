# appifier [![npm version](https://badge.fury.io/js/appifier.svg)](https://badge.fury.io/js/appifier)

| Linux | macOS | Windows |
| ----- | ----- | ------- |
| [![Travis Build Status](https://travis-ci.org/quanglam2807/appifier.svg?branch=master)](https://travis-ci.org/quanglam2807/appifier) | [![Travis Build Status](https://travis-ci.org/quanglam2807/appifier.svg?branch=master)](https://travis-ci.org/quanglam2807/appifier) | [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/quanglam2807/appifier?branch=master&svg=true)](https://ci.appveyor.com/project/quanglam2807/webcatalog/branch/master) |

**appifier** is a Node.js library/CLI which turns any web site into native app. It works similarly to [nativefier](https://github.com/jiahaog/Nativefier) but is designed with a more consumer-friendly mindset.

## Requirements
- macOS 10.9+, Windows 7+ or Linux.
- Node.js 8+.

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
