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

`--url <value>`: The url to point the application at. Defaults to `https://webcatalog.io`.

`--dest <value>`: Specifies the destination directory to build the app to, defaults to the current working directory. Defaults to `.` (current dir).

`--name <value>`: The name of the application, which will affect strings in titles and the icon. Defaults to `Molecule`.

`--id <value>`: The ID of the application, which will affect the name of the folder contains the app. Defaults to `molecule`.

`--auto-hide-menu-bar`: Controls Electron `BrowserWindows`'s `autoHideMenuBar` [option](https://electronjs.org/docs/api/browser-window#new-browserwindowoptions). Defaults to `false`.

`--dark-theme`: Controls `material-ui`'s dark theme [option](https://material-ui-next.com/customization/themes/#dark-light-theme). Defaults to `false`.

`--inject-css`: Inject CSS script. **Inline CSS only** so if your injected code is big, modify this option using the GUI inside the generated app.

`--inject-js`: Inject JS script. **Inline JS only** so if your injected code is big, modify this option using the GUI inside the generated app.

`--navigation-bar-position`: Navigation bar (Home, Back, Forward, etc) position. Can be `left`, `right` or `top`. Defaults to `left`.

`--remember-last-page`: Controls whether the app should start with the default URL or with the last page visited. Defaults to `false`.

`--show-navigation-bar`: Shows/hides navigation bar. Defaults to `true`.

`--swipe-to-navigate`: **macOS only**. Controls the ability to swipe with 3-finger to navigate back and forward. Defaults to `true`.

`--use-hardware-acceleration`: Toggles hardward acceleration. Defaults to `true`.

`--user-agent`: Custom User-Agent.

`--use-spell-checker`: Toggles spell checker.

## Programmatic API

You can use the Nativefier programmatic API as well.

```bash
# install and save to package.json
npm install --save nativefier
```

In your `.js` file:

```javascript
const appifier = require('appifier');

const options = {
  autoHideMenuBar: true,
};

appifier.createAppAsync(
  'duckduckgo',
  'DuckDuckGo',
  'https://duckduckgo.com',
  path.resolve(__dirname, 'test', 'icon.png'),
  path.resolve(__dirname, 'dist'),
  options,
)
  .then(appPath => console.log(`App has been appified to ${appPath}`))
  .then(err => console.log(err));
});
```

Available options are listed at [app/appifier.json](app/appifier.json). Descriptions about the options can be found at the ["Command Line" section above](#command-line).
