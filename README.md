# WebCatalog Backend
[![Build Status](https://travis-ci.org/webcatalog/backend.svg?branch=master)](https://travis-ci.org/webcatalog/backend)
[![MIT License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/webcatalog/backend/blob/master/LICENSE)


#### Homepage: https://getwebcatalog.com


## Introduction
WebCatalog Backend is a prebuilt static site used by [WebCatalog Desktop](https://github.com/webcatalog/desktop) as its main API server.

## Development
With Node.js 6.x & Yarn installed, run

```bash
git clone https://github.com/webcatalog/backend.git
cd desktop
yarn
```

Then, you need to add Algolia environment variables:
```bash
export ALGOLIA_APPLICATION_ID=
export ALGOLIA_API_KEY=
```

To run the script:
```bash
yarn start
```
