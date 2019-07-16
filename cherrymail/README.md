# CherryMail [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![Travis Build Status](https://travis-ci.com/quanglam2807/cherrymail.svg?branch=master)](https://travis-ci.com/quanglam2807/cherrymail)

**[CherryMail](https://getcherrymail.com)** - The Same Emails You Love. Enhanced.

---

## Notes
**CherryMail is open-source but not free.** You can add up to one account for free. [Pay just $9.99](https://webcatalog.onfastspring.com/cherrymail/cherrymail-app) to add as many as you need.

CherryMail has permanent licenses, which have no time limit. In other words, the license never expires and works with all versions (including major updates). Also, your license permits you to use the app on all of the devices you own, as long as you are the only one using the app.

---

## Development
```
# First, clone the project:
git clone https://github.com/quanglam2807/cherrymail.git
cd cherrymail

# install the dependencies
yarn

# Run development mode of CherryMail
yarn electron-dev

# Run development mode of the template app
yarn template:electron-dev

# Build for production
yarn template:prepare
yarn dist
```