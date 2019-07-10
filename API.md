<!-- https://raw.githubusercontent.com/jiahaog/nativefier/master/docs/api.md -->
# API

## Table of Contents
- [Command Line](#command-line)
- [Programmatic API](#programmatic-api)

## Command Line

```bash
appifier [options]
```
Command line options are listed below.

`-h, --help`: Prints the usage information.

`-v, --version`: Prints the version of your `appifier` install.

`--id <value>`: The ID of the application, which will affect the name of the folder contains the app. Defaults to `molecule`.

`--name <value>`: The name of the application, which will affect strings in titles and the icon. Defaults to `Molecule`.

`--url <value>`: The url to point the application at. Defaults to `https://github.com/webcatalog/appifier`.

`--icon <value>`: The application icon path. Defaults to Electron icon.

`--dest <value>`: Specifies the destination directory to build the app to, defaults to the current working directory. Defaults to `.` (current dir).

## Programmatic API

You can use the Nativefier programmatic API as well.

```bash
# install and save to package.json
npm install --save nativefier
```

In your `.js` file:

```javascript
const appifier = require('appifier');

appifier.createAppAsync(
  'duckduckgo',
  'DuckDuckGo',
  'https://duckduckgo.com',
  path.resolve(__dirname, 'test', 'icon.png'),
  path.resolve(__dirname, 'dist'),
)
  .then(appPath => console.log(`App has been appified to ${appPath}`))
  .then(err => console.log(err));
});
```

Descriptions about the options can be found at the ["Command Line" section above](#command-line).
