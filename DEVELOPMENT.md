<!-- https://raw.githubusercontent.com/jiahaog/nativefier/master/docs/development.md -->

# Development
## Environment Setup

First, clone the project:

```bash
git clone https://github.com/webcatalog/appifier.git
cd appifier
```

Then install the dependencies: `yarn`

If the dependencies are installed and you want to build the code: `yarn build` or `npm run build`.

You can set up a symbolic link so that running `appifier` invokes your development version including your changes: `yarn link` or `npm link`.

After doing so (and not forgetting to build with `yarn build`), you can run **appifier** with your test parameters:

```bash
appifier <--your-awesome-new-flag>
```

To develop the template Electron app, run `yarn electron-dev`. It'll automatically watch the files for changes and reload accordingly. Still, if you modify files in the main process (`./app/main`), you'll need to manually re-run the script.

## Tests

```bash
# To run all tests (unit, end-to-end),
npm test
```
