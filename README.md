# WebCatalog Desktop
[![Travis Build Status](https://travis-ci.org/webcatalog/desktop.svg?branch=master)](https://travis-ci.org/webcatalog/desktop)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/webcatalog/desktop?branch=windows&svg=true)](https://ci.appveyor.com/project/webcatalog/desktop/branch/master)
[![MIT License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/webcatalog/desktop/blob/master/LICENSE)
[![Donate with Paypal](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=JZ2Y4F47ZMGHE&lc=US&item_name=WebCatalog&item_number=webcatalog&currency_code=USD)

#### Homepage: https://getwebcatalog.com

## Introduction
WebCatalog Desktop is a desktop app which allows users to install and run web apps natively. It offers similar functionalities with [Fluid](http://fluidapp.com/) and [Nativefier](https://github.com/jiahaog/nativefier) but with different approach and a more user-friendly UI.

WebCatalog Desktop needs to rely on [WebCatalog Backend](https://github.com/webcatalog/backend) to store data and manage app updates.

## Development
With Node.js 6.x & Yarn installed, run

```bash
git clone https://github.com/webcatalog/desktop.git
cd desktop
yarn
```

To run the app for development:
```bash
yarn run dev
yarn start
```

To build the app for release:
```bash
yarn run dist
```
