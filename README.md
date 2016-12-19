# WebCatalog Desktop
[![Build Status](https://travis-ci.org/webcatalog/desktop.svg?branch=master)](https://travis-ci.org/webcatalog/desktop)
[![MIT License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/quanglam2807/webcatalog/blob/master/LICENSE)


#### Homepage: https://getwebcatalog.com


## Introduction
WebCatalog Desktop is a Mac app which allows users to install and run web apps natively. It offers similar functionalities with [Fluid](http://fluidapp.com/) and [Nativefier](https://github.com/jiahaog/nativefier) but with different approach and a more user-friendly UI.

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

To build the app:
```bash
yarn run build
yarn run dist
```
