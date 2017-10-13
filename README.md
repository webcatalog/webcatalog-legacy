<img src="build-resources/icon.png" height="128" width="128" alt="WebCatalog" />

# WebCatalog

[![Travis Build Status](https://travis-ci.org/webcatalog/webcatalog.svg?branch=master)](https://travis-ci.org/webcatalog/webcatalog)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/webcatalog/webcatalog?branch=master&svg=true)](https://ci.appveyor.com/project/webcatalog/webcatalog/branch/master)

#### Homepage: https://webcatalog.io

## Introduction
WebCatalog is a desktop app which allows users to install and run any web app natively.

![WebCatalog for macOS](/build-resources/screenshot.png)

## Development
Install [Node.js 8](https://nodejs.org), [Yarn](https://yarnpkg.com).

If you use Windows, consider to use `LF` for Git.
```
git config --global core.autocrlf false
git config --global core.eol lf
```

Then, continue:

```bash
git clone https://github.com/webcatalog/webcatalog.git
cd webcatalog
yarn
```

To run the app for development: `yarn electron-dev`

To build the app for release: `yarn dist`
