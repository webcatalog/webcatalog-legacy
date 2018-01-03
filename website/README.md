<!--
Inspired by https://github.com/reddit/reddit/blob/f943ac95dea022c65e1b131b1936b2453da8cd3e/README.md
-->

# WebCatalog Server
[![Travis Build Status](https://travis-ci.org/webcatalog/webcatalog.io.svg?branch=master)](https://travis-ci.org/webcatalog/webcatalog.io)

This is the primary codebase that powers [webcatalog.io](https://webcatalog.io).

For notices about major changes and general discussion of WebCatalog development, go to [webcatalog/webcatalog](https://github.com/quanglam2807/webcatalog) repo.

### Requirements
- Node.js 8+
- Yarn

Then, set the environment variables:
```
VERSION='latest public WebCatalog version'
```

### Quickstart
To set up your own instance of `webcatalog-server` to develop with:
```bash
git clone https://github.com/quanglam2807/webcatalog.io.git
cd webcatalog-server
yarn
yarn dev
```

To run the app in production:
```bash
yarn build
yarn start
```

### APIs
To learn more about Webcatalog's API, check out [the API wiki page](https://github.com/quanglam2807/webcatalog.io/wiki).

Happy hacking!
