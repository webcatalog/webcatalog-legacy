# Juli [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![Travis Build Status](https://travis-ci.org/quanglam2807/juli.svg?branch=master)](https://travis-ci.org/quanglam2807/juli) [![Build status](https://ci.appveyor.com/api/projects/status/6ebvm0ldumh29ic5?svg=true)](https://ci.appveyor.com/project/quanglam2807/juli)

**[Juli](https://quang.im/juli)** is an app which allows you to run web apps like real desktop apps with notification, dock badge, dark mode & more. It is a maintained fork of [Appifier](https://github.com/quanglam2807/appifier).

## Development
### Requirements
- macOS 10.9+ or Windows 7.
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
