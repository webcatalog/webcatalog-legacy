# WebCatalog Desktop
[![Travis Build Status](https://travis-ci.org/webcatalog/desktop.svg?branch=master)](https://travis-ci.org/webcatalog/desktop)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/webcatalog/desktop?branch=windows&svg=true)](https://ci.appveyor.com/project/webcatalog/desktop/branch/master)
[![MIT License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/quanglam2807/webcatalog/blob/master/LICENSE)

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

(for Windows)
```bash
yarn run dev-windows
yarn start
```

To build the app for release:
```bash
yarn run dist
```

(for Windows)
```bash
yarn run dist-windows
```
