# WebCatalog [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](LICENSE)

|macOS|
|---|
|[![macOS](https://github.com/webcatalog/webcatalog-app/workflows/macOS/badge.svg)](https://github.com/webcatalog/webcatalog-app/actions?query=workflow:%22macOS%22)|

|Linux (x64)|Linux (arm64)|
|---|---|
|[![Linux (x64)](https://github.com/webcatalog/webcatalog-app/workflows/Linux%20(x64)/badge.svg)](https://github.com/webcatalog/webcatalog-app/actions?query=workflow%3A%22Linux+%28x64%29%22)|[![Linux (arm64)](https://github.com/webcatalog/webcatalog-app/workflows/Linux%20(arm64)/badge.svg)](https://github.com/webcatalog/webcatalog-app/actions?query=workflow%3A%22Linux+%28arm64%29%22)|

|Windows (x64)|Windows (arm64)|
|---|---|
|[![Windows (x64)](https://github.com/webcatalog/webcatalog-app/workflows/Windows%20(x64)/badge.svg)](https://github.com/webcatalog/webcatalog-app/actions?query=workflow%3A%22Windows+%28x64%29%22)|[![Windows (arm64)](https://github.com/webcatalog/webcatalog-app/workflows/Windows%20(arm64)/badge.svg)](https://github.com/webcatalog/webcatalog-app/actions?query=workflow%3A%22Windows+%28arm64%29%22)|

**[WebCatalog](https://webcatalog.app)** - Turn Websites into Desktop Apps.

**master** branch only includes the source code of WebCatalog 13 and above. For older versions, check out the **legacy-** branches.

---

## Licensing
### Usage
**WebCatalog is a commercial product.** [Learn more about  our pricing](https://webcatalog.app).

### Source Code
On the other hand, **the source code is freely available** for use, modification and distribution under the permissions, limitations and conditions listed in the [Mozilla Public License 2.0](LICENSE).

---

## Development
This repository only contains the source code of the WebCatalog app. If you'd like to contribute to [WebCatalog Engine](https://help.webcatalog.app/article/23-what-is-webcatalog-engine), the core that powers the apps created with WebCatalog, check out <https://github.com/webcatalog/webcatalog-engine>.

For the app to be fully functional, set these environment variables:
```
REACT_APP_AMPLITUDE_API_KEY=
REACT_APP_SWIFTYPE_HOST_ID=
REACT_APP_SWIFTYPE_SEARCH_KEY=
REACT_APP_SWIFTYPE_ENGINE_NAME=
ELECTRON_APP_SENTRY_DSN=
```

Then, run:
```bash
# clone the project:
git clone https://github.com/webcatalog/webcatalog-app.git
cd webcatalog-app

# install the dependencies
yarn

# run the app
yarn electron-dev

# Build for production
yarn dist
```
