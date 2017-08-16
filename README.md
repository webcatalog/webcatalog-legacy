# molecule
[![CircleCI](https://circleci.com/gh/webcatalog/molecule.svg?style=svg&circle-token=f2513ee30140f077d85b0c269d1d9ce36464f015)](https://circleci.com/gh/webcatalog/molecule)

Javascript library to make any web page a desktop application.

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
yarn install:client:full
yarn electron-dev
```
