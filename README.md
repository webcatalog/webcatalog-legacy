[![WebCatalog](http://i.imgur.com/WhgnaPN.png)](https://getwebcatalog.com)

[![Join the chat at https://gitter.im/webcatalog/webcatalog](https://badges.gitter.im/webcatalog/webcatalog.svg)](https://gitter.im/webcatalog/webcatalog?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Travis Build Status](https://travis-ci.org/webcatalog/webcatalog.svg?branch=master)](https://travis-ci.org/webcatalog/webcatalog)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/webcatalog/webcatalog?branch=master&svg=true)](https://ci.appveyor.com/project/webcatalog/webcatalog/branch/master)
[![MIT License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/webcatalog/webcatalog/blob/master/LICENSE)
[![Donate with Paypal](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=JZ2Y4F47ZMGHE&lc=US&item_name=WebCatalog&item_number=webcatalog&currency_code=USD)

#### Homepage: https://getwebcatalog.com

## Introduction
WebCatalog is a desktop app which allows users to install and run any web app natively. It offers similar functionalities with [Fluid](http://fluidapp.com/) and [Nativefier](https://github.com/jiahaog/nativefier) but with more features and user-friendly user interface.

![Demo](http://i.imgur.com/mXlu7PG.gif)

## Development
With Node.js 6+ & Yarn installed, run

```bash
git clone https://github.com/webcatalog/webcatalog.git
cd desktop
yarn
```

To run the app for development:
```bash
yarn package # electron-builder needs to be run to install node dependencies & rebuild native dependencies
yarn dev # start webpack dev
yarn start # run app
```

To build the app for release:
```bash
yarn dist
```
