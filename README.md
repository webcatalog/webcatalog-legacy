# WebCatalog [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](LICENSE)

|macOS|
|---|
|[![macOS](https://github.com/webcatalog/webcatalog-app/workflows/macOS/badge.svg)](https://github.com/webcatalog/webcatalog-app/actions?query=workflow:%22macOS%22)|

|Windows|
|---|
|[![Windows](https://github.com/webcatalog/webcatalog-app/workflows/Windows/badge.svg)](https://github.com/webcatalog/webcatalog-app/actions?query=workflow:%22Windows%22)|

|Linux (x64)|Linux (arm64)|
|---|---|
|[![Linux (x64)](https://github.com/webcatalog/webcatalog-app/workflows/Linux%20(x64)/badge.svg)](https://github.com/webcatalog/webcatalog-app/actions?query=workflow%3A%22Linux+%28x64%29%22)|[![Linux (arm64)](https://github.com/webcatalog/webcatalog-app/workflows/Linux%20(arm64)/badge.svg)](https://github.com/webcatalog/webcatalog-app/actions?query=workflow%3A%22Linux+%28arm64%29%22)|

**[WebCatalog](https://webcatalog.app)** - Turn Websites into Desktop Apps.

**master** branch only includes the source code of WebCatalog 13 and above. For older versions, check out the **legacy-** branches.

---

## Licensing
### Usage
**WebCatalog is a commercial product.** [Learn more about  our pricing](https://webcatalog.app/pricing).

### Source Code
On the other hand, **the source code is freely available** for use, modification and distribution under the permissions, limitations and conditions listed in the [Mozilla Public License 2.0](LICENSE).

---

## Development
This repository only contains the source code of the WebCatalog app. If you'd like to contribute to [Neutron](https://help.webcatalog.app/article/23-what-is-neutron), the core that powers the apps created with WebCatalog, check out <https://github.com/webcatalog/webcatalog-engine>.

For the app to be fully functional, set these environment variables:
```
REACT_APP_AMPLITUDE_API_KEY=
REACT_APP_ELASTIC_CLOUD_APP_SEARCH_SEARCH_KEY=
REACT_APP_ELASTIC_CLOUD_APP_SEARCH_API_ENDPOINT=
REACT_APP_ELASTIC_CLOUD_APP_SEARCH_ENGINE_NAME=
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
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
