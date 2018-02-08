# WebCatalog
[![Travis Build Status](https://travis-ci.org/quanglam2807/webcatalog.svg?branch=master)](https://travis-ci.org/quanglam2807/webcatalog).

**Notice:** The original WebCatalog has been streamlined and renamed to [Appifier](https://github.com/quanglam2807/appifier). This app is a fork of the original one and only works on macOS.

---

**WebCatalog** acts as GUI (graphical user interface) for **appifier** [![npm version](https://badge.fury.io/js/appifier.svg)](https://badge.fury.io/js/appifier) to make it more accessible to non-technical users. The app includes a [web app catalog](https://github.com/quanglam2807/webcatalog-apps); automatically adds generated native apps to menu or desktop; and provides an interface to manage and update the apps. It also offers some additional optimizations like [resource sharing](https://github.com/quanglam2807/webcatalog/issues/171).

![WebCatalog for macOS](/build-resources/demo.gif)

---

## Requirements
- macOS 10.9+.
- Node.js 8+.

## Usage
To create a native desktop app for [duckduckgo.com](https://duckduckgo.com):

Download and install WebCatalog from its official website: https://webcatalog.io. Open WebCatalog, then search for DuckDuckGo. Finally, click "Install" and wait for a while. Done! Magic.

## How It Works
WebCatalog is an Electron app which basically uses `appifier` under the hood to generate the apps. Additionally, WebCatalog reads the metadata stored in the generated apps to allow users to easily manage & update them.
