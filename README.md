# WebCatalog Lite [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![Travis Build Status](https://travis-ci.org/quanglam2807/webcatalog.svg?branch=master)](https://travis-ci.org/quanglam2807/webcatalog)

**[WebCatalog Lite](https://getwebcatalog.com)** helps you turn any website into desktop app with just one click. It is the **incompatible** successor of [Appifier](https://github.com/quanglam2807/appifier).

> Originally, WebCatalog relied on [Electron](https://electronjs.org) to *appify* website into desktop app, which allowed its developers to customize and extend the functionalities freely. But Electron also had many quirks: each *appified* app included a heavy Electron framework, and it was cumbersome to bundle a proper Electron build system on 3 different platforms; etc.

> WebCatalog Lite app is still built on top of Electron, but it uses the installed browsers on your machine to power its created apps ([@vackosar](https://vaclavkosar.com/2018/02/25/Creating-Custom-Ubuntu-Web-Link-App.html), [@natermer](https://www.reddit.com/r/linux/comments/7ivuit/create_firefoxbased_web_apps_for_gnome_and/)). So *appified* apps are always up-to-date with your browsers, and WebCatalog no longer has to do all the dirty works. The result is a new lightweight, maintainable, secure and up-to-date product.

![WebCatalog Lite for macOS](/build-resources/demo.gif)

## Development
```
# First, clone the project:
git clone https://github.com/quanglam2807/webcatalog.git
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
