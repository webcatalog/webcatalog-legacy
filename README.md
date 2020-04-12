# WebCatalog [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](LICENSE)

|macOS|Linux|Windows|Catalog|
|---|---|---|---|
|[![GitHub Actions macOS Build Status](https://github.com/atomery/webcatalog/workflows/macOS/badge.svg)](https://github.com/atomery/webcatalog/actions?query=workflow%3AmacOS)|[![GitHub Actions Linux Build Status](https://github.com/atomery/webcatalog/workflows/Linux/badge.svg)](https://github.com/atomery/webcatalog/actions?query=workflow%3ALinux)|[![GitHub Actions Windows Build Status](https://github.com/atomery/webcatalog/workflows/Windows/badge.svg)](https://github.com/atomery/webcatalog/actions?query=workflow%3AWindows)|[![GitHub Actions Catalog Build Status](https://github.com/atomery/webcatalog/workflows/Catalog/badge.svg)](https://github.com/atomery/webcatalog/actions?query=workflow%3ACatalog)|


**[WebCatalog](https://webcatalogapp.com)** - Run Web Apps like Real Apps.

**master** branch only includes the source code of WebCatalog 13 & up. For older versions, check out the **legacy-** branches.

---

## Licensing
### Usage
**WebCatalog is paid software.** You can install up to two apps for free or [pay just $14.99](https://webcatalog.onfastspring.com/webcatalog-lite) to install as many as you need.

The license:
- Lets you add unlimited apps and workspaces.
- Has no time limit and never expires.
- Works with all versions (including major updates).
- Permits uses on all of the devices you own (regardless of platforms or operating systems).

### Source Code
On the other hand, **the source code is freely available** for use, modification and distribution under the permissions, limitations, & conditions listed in the [Mozilla Public License 2.0](LICENSE).

---

## Development
```
# First, clone the project:
git clone https://github.com/atomery/webcatalog.git
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
