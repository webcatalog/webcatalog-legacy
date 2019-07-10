<img src="build-resources/icon.png" height="128" width="128" alt="Secreton" />

# Secreton

[![Travis Build Status](https://travis-ci.org/secreton/secreton.svg?branch=master)](https://travis-ci.org/secreton/secreton)

#### Homepage: https://secretonapp.com

## Introduction
Privacy-Focused, Distraction-Free Browser

![Secreton for macOS](/build-resources/screenshot.png)

## Development
Install [Node.js 8](https://nodejs.org), [Yarn](https://yarnpkg.com).

If you use Windows, consider to use `LF` for Git.
```
git config --global core.autocrlf false
git config --global core.eol lf
```

Then, continue:

```bash
git clone https://github.com/secreton/secreton.git
cd secreton
yarn
```

To run the app for development: `yarn electron-dev`

To build the app for release: `yarn dist`
