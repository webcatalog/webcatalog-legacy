# webcatalog & appifier

| Linux | macOS | Windows |
| ----- | ----- | ------- |
| [![Travis Build Status](https://travis-ci.org/webcatalog/webcatalog.svg?branch=master)](https://travis-ci.org/webcatalog/webcatalog) | [![Travis Build Status](https://travis-ci.org/webcatalog/webcatalog.svg?branch=master)](https://travis-ci.org/webcatalog/webcatalog) | [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/webcatalog/webcatalog?branch=master&svg=true)](https://ci.appveyor.com/project/webcatalog/webcatalog/branch/master) |

**appifier** is a Node.js library/CLI which turns any web site into native app. It works similarly to [nativefier](https://github.com/jiahaog/Nativefier) but is designed with a more consumer-friendly mindset.

**WebCatalog** acts as GUI (graphical user interface) for **appifier** to make it more accessible to non-technical users. The app includes a [web app catalog](https://github.com/webcatalog/webcatalog-apps); automatically adds generated native apps to menu or desktop; and provides an interface to manage and update the apps. It also offers some additional optimizations like [resource sharing](https://github.com/webcatalog/webcatalog/issues/171).

![WebCatalog for macOS](/build-resources/demo.gif)

---

## Requirements
- macOS 10.9+, Windows 7+ or Linux.
- Node.js 8+.

## Usage
Creating a native desktop app for [duckduckgo.com](https://duckduckgo.com):

### WebCatalog (GUI)
Download and install WebCatalog from its official website: https://webcatalog.io. Open WebCatalog, then search for DuckDuckGo. Finally, click "Install" and wait for a while. Done! Magic.

### Command Line
Install: `npm install appifier -g` or `yarn global add appifier`

```bash
appifier --name "DuckDuckGo" --url "https://duckduckgo.com" --icon ./icon.png
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
  .then(() => console.log('ok'))
  .then(err => console.log(err));
```

### Notes
Read the [API documentation](API.md) for other command line flags and options which can be used to configure the packaged app. Still, it is not really necessary as you can modify the options later using the GUI inside the generated app.

---

## How It Works
A template Electron app is included in the `./packages/appifier/app` folder. When the `appifier` command or programmatic API is executed, this folder is copied to a temporary directory with the appropriate parameters in a configuration file, and is packaged into an app with [electron-packager](https://github.com/electron-userland/electron-packager).

WebCatalog is an Electron app which basically uses `appifier` under the hood to generate the apps. Additionally, WebCatalog reads the metadata stored in the generated apps to allow users to easily manage & update them.

---

## API Documentation
See [API](API.md).

---

## Development
See [DEVELOPMENT](DEVELOPMENT.md).
