# WebCatalog [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](LICENSE)

|macOS|Linux|Windows|
|---|---|---|
|[![GitHub Actions macOS Build Status](https://github.com/webcatalog/webcatalog-app/workflows/macOS/badge.svg)](https://github.com/webcatalog/webcatalog-app/actions?query=workflow%3AmacOS)|[![GitHub Actions Linux Build Status](https://github.com/webcatalog/webcatalog-app/workflows/Linux/badge.svg)](https://github.com/webcatalog/webcatalog-app/actions?query=workflow%3ALinux)|[![GitHub Actions Windows Build Status](https://github.com/webcatalog/webcatalog-app/workflows/Windows/badge.svg)](https://github.com/webcatalog/webcatalog-app/actions?query=workflow%3AWindows)|


**[WebCatalog](https://webcatalog.app)** - Turn Websites into Desktop Apps.

**master** branch only includes the source code of WebCatalog 13 & up. For older versions, check out the **legacy-** branches.
---

## Licensing
### Usage
**WebCatalog is paid software.** [Learn more about  our pricing](https://webcatalog.app).

### Source Code
On the other hand, **the source code is freely available** for use, modification and distribution under the permissions, limitations and conditions listed in the [Mozilla Public License 2.0](LICENSE).

---

## Development
```
# First, clone the project:
git clone https://github.com/webcatalog/webcatalog-app.git
cd webcatalog

# install the dependencies
yarn
yarn template:install

# Run development mode of WebCatalog
yarn electron-dev

# Run development mode of the template app
yarn template:electron-dev

# Build for production
yarn template:prepare
yarn dist
```
