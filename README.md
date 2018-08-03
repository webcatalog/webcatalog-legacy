# WebCatalog [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![Travis Build Status](https://travis-ci.org/quanglam2807/webcatalog.svg?branch=master)](https://travis-ci.org/quanglam2807/webcatalog) [![Build status](https://ci.appveyor.com/api/projects/status/6l9ycaxsweytrpg3?svg=true)](https://ci.appveyor.com/project/quanglam2807/webcatalog)

**[WebCatalog](https://getwebcatalog.com)** helps you turn any website into desktop app ([site-specific browser](https://en.wikipedia.org/wiki/Site-specific_browser)). It allows you to pick your preferred web engine: Google Chrome, Chromium ([@vackosar](https://vaclavkosar.com/2018/02/25/Creating-Custom-Ubuntu-Web-Link-App.html)); Firefox ([@natermer](https://www.reddit.com/r/linux/comments/7ivuit/create_firefoxbased_web_apps_for_gnome_and/)); Juli ([@quanglam2807](https://github.com/quanglam2807/juli)).

![WebCatalog for macOS](/build-resources/demo.gif)

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

# To run all tests
yarn run test
```
