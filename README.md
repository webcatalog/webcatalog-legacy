# WebCatalog Lite [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![Travis Build Status](https://travis-ci.org/quanglam2807/webcatalog-lite.svg?branch=master)](https://travis-ci.org/quanglam2807/webcatalog-lite)

**[WebCatalog Lite](https://quang.im/webcatalog)** helps you turn any website into desktop app with just one click. It is the **incompatible** successor of [WebCatalog 10](https://github.com/quanglam2807/webcatalog) & [Appifier](https://github.com/quanglam2807/appifier).

WebCatalog Lite itself is built on top of [Electron](https://electronjs.org) but it uses installed browsers on your machine to power its created apps ([1](vaclavkosar.com/2018/02/25/Creating-Custom-Ubuntu-Web-Link-App.html), [2](https://www.reddit.com/r/linux/comments/7ivuit/create_firefoxbased_web_apps_for_gnome_and/)).

![WebCatalog Lite for macOS](/build-resources/demo.gif)

## Development
```
# First, clone the project:
git clone https://github.com/quanglam2807/webcatalog-lite.git
cd webcatalog

# install the dependencies
yarn

# Run development mode
yarn electron-dev

# Build for production
yarn dist

# To run all tests for WebCatalog Lite
yarn run test
```
