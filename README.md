# Appifier [![npm version](https://badge.fury.io/js/appifier.svg)](https://badge.fury.io/js/appifier) [![Travis Build Status](https://travis-ci.org/quanglam2807/appifier.svg?branch=master)](https://travis-ci.org/quanglam2807/appifier) [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/quanglam2807/appifier?branch=master&svg=true)](https://ci.appveyor.com/project/quanglam2807/appifier/branch/master)

**Appifier** is an app + Node.js library + CLI which turns any website into Electron app.

**CAUTION:** The project will receive security updates but it is no longer under active development.

![Demo](demo.gif)

> If you follow this repo long enough, you'd wonder what the f\*ck wrong with this project and its developer: The guy just kept rewriting the app over and over again. Is he insane? How much time does he spend on this? It's just a web wrapper generator, not a rocket and he spent more than a year working on it, what!? Well, "Intellectuals solve problems, geniuses prevent them," said Albert Einstein. Sadly, the guy was neither an intellectual nor a genius. He was just a naive freshman at a liberal arts college, busying to read classical texts instead of learning about practical software engineering. He messed up. He was ambitious, passionate but then he was stupid enough not to read something like *Lean Startup*. As a result, what's supposed to happen happened :). It's a long story. Nevertheless, this paragraph pretty much sums it up.

> If you don't really need Appifier, use **[WebCatalog Lite](https://github.com/quanglam2807/webcatalog-lite)** or [Nativefier](https://github.com/jiahaog/nativefier) instead.

> Old Git history prior to March 2018 is squashed. You can still find it [here](https://github.com/quanglam2807/appifier/tree/feb-26-full-history).

## Requirements
- macOS 10.9+, Windows 7+ or Linux.
- Node.js 8+.
- Yarn

## Usage
To create a native desktop app for [duckduckgo.com](https://duckduckgo.com):

### GUI (not recommended)
Download & install Appifier GUI at https://github.com/quanglam2807/appifier/releases

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
A template Electron app is included in the `./appifier/app` folder. When the `appifier` command or programmatic API is executed, this folder is copied to a temporary directory with the appropriate parameters in a configuration file, and is packaged into an app with [electron-packager](https://github.com/electron-userland/electron-packager).

---

## API Documentation
See [API](API.md).

---

## Development
See [DEVELOPMENT](DEVELOPMENT.md).
