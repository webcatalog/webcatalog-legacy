# Appifier

| Linux | macOS | Windows |
| ----- | ----- | ------- |
| [![Travis Build Status](https://travis-ci.org/quanglam2807/appifier.svg?branch=master)](https://travis-ci.org/quanglam2807/appifier) | [![Travis Build Status](https://travis-ci.org/quanglam2807/appifier.svg?branch=master)](https://travis-ci.org/quanglam2807/appifier) | [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/quanglam2807/appifier?branch=master&svg=true)](https://ci.appveyor.com/project/quanglam2807/appifier/branch/master) |

**appifier** [![npm version](https://badge.fury.io/js/appifier.svg)](https://badge.fury.io/js/appifier) is a Node.js library/CLI which turns any web site into native app. It works similarly to [nativefier](https://github.com/jiahaog/Nativefier) but is designed with a more consumer-friendly mindset.

**Appifier** also has a GUI (graphical user interface) built with Electron to make it more accessible to non-technical users. The app provides a simple interface to create apps. It also offers some additional optimizations like [resource sharing](https://github.com/quanglam2807/appifier/issues/171).

![Appifier for macOS](/build-resources/demo.gif)

---

## Requirements
- macOS 10.9+, Windows 7+ or Linux.
- Node.js 8+.

## Usage
Creating a native desktop app for [duckduckgo.com](https://duckduckgo.com):

### Appifier (GUI)
Download and install Appifier from its official website: https://quang.im/appifier. Fill in the name and the URL. Finally, click "Create" and wait for a while. Done! Magic.

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
A template Electron app is included in the `./packages/appifier/app` folder. When the `appifier` command or programmatic API is executed, this folder is copied to a temporary directory with the appropriate parameters in a configuration file, and is packaged into an app with [electron-packager](https://github.com/electron-userland/electron-packager).

Appifier.app is an Electron app which basically uses `appifier` under the hood to generate the apps.

---

## API Documentation
See [API](API.md).

---

## Development
See [DEVELOPMENT](DEVELOPMENT.md).
