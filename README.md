# molecule
[![npm package](https://img.shields.io/npm/v/@webcatalog/molecule.svg)](https://www.npmjs.org/package/@webcatalog/molecule)

| Platform        | Build Status           |
| ------------- |:-------------:|
| Linux      | [![CircleCI](https://circleci.com/gh/webcatalog/molecule.svg?style=svg&circle-token=f2513ee30140f077d85b0c269d1d9ce36464f015)](https://circleci.com/gh/webcatalog/molecule) |
| macOS      | [![Travis Build Status](https://travis-ci.org/webcatalog/molecule.svg?branch=master)](https://travis-ci.org/webcatalog/molecule)      |
| Windows | [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/webcatalog/molecule?branch=master&svg=true)](https://ci.appveyor.com/project/webcatalog/molecule/branch/master)      |

Node.js module which turns web app into Electron app.

![Facebook Messenger app for macOS, created with Molecule](/screenshot.png)

### Usage
```
yarn add @webcatalog/molecule
```

```js
createAppAsync(
  'google',
  'Google',
  'https://google.com',
  path.resolve(__dirname, 'test', '828296a5-0969-4a56-8e68-e188b03584b0.icns'),
  path.resolve(__dirname, 'dist'),
)
.then(() => console.log('ok'))
.then(err => console.log(err));
```

### Development
```bash
yarn
yarn install-app-full
yarn electron-dev
```

`yarn install-app-full` is required because running `yarn` only installs the production `dependencies`, not `devDependencies`. This trick is to minimize WebCatalog package size.
