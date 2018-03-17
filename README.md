# Juli [![Travis Build Status](https://travis-ci.org/quanglam2807/juli.svg?branch=master)](https://travis-ci.org/quanglam2807/juli)

**Juli** is an app which allows you to run web apps like real Mac apps with notification, dock badge, menu bar integration & more. It is a maintained fork of [Appifier](https://github.com/quanglam2807/appifier), optimized for macOS.

## Development
### Requirements
- macOS 10.9+.
- Node.js 8+.
- Yarn

### Commands
```bash
# First, clone the project:
git clone https://github.com/quanglam2807/juli.git
cd juli

# install the dependencies
yarn

# To develop the main Electron app, run
yarn electron-dev

# To develop the template Electron app, run
yarn template:electron-dev

# To run all tests for Juli GUI
yarn run test

# build for distribution
yarn dist
```
