# WebCatalog [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![Travis Build Status](https://travis-ci.com/quanglam2807/webcatalog.svg?branch=master)](https://travis-ci.com/quanglam2807/webcatalog)

**[WebCatalog](https://getwebcatalog.com)** - Bring Thousands of Apps to Your Mac.

**master** branch only includes the source code of WebCatalog 13 & up. For older versions, check out the **legacy-** branches.

---

## Notes
**WebCatalog is open-source but not free.** You can install up to two apps for free. [Pay just 10 USD](https://webcatalog.onfastspring.com/webcatalog-lite) to install as many as you need.

WebCatalog has permanent licenses, which have no time limit. In other words, the license never expires. Also, your license permits you to use the app on all of the devices you own, as long as you are the only one using the app.

WebCatalog 13 is a free upgrade. So if you already have a WebCatalog 12 license, you can just use it to activate WebCatalog 13.

---

## Development
```
# First, clone the project:
git clone https://github.com/quanglam2807/webcatalog.git
cd webcatalog

# install the dependencies
yarn

# Run development mode of WebCatalog
yarn electron-dev

# Run development mode of the template app
yarn template:electron-dev

# Build for production
yarn template:prepare
yarn dist
```
