<!-- https://raw.githubusercontent.com/jiahaog/nativefier/master/docs/development.md -->

# Development
## Environment Setup

```bash
# First, clone the project:
git clone https://github.com/quanglam2807/webcatalog.git
cd appifier

# WebCatalog
# install the dependencies
yarn
# Run development mode
yarn electron-dev
# Build for production
yarn dist

# appifier
# move the directory
cd packages/appifier
# build the code
yarn build
# set up a symbolic link so that running appifier invokes your development version including your changes
yarn link
# after doing so (and not forgetting to build with `yarn build`)
# you can runappifier with your test parameters
appifier <--your-awesome-new-flag>
# To develop the template Electron app, run
yarn electron-dev
# It'll automatically watch the files for changes and reload accordingly.
# Still, if you modify files in the main process (./app/main),
# you'll need to manually re-run the script.
```

## Tests

```bash
# To run all tests for WebCatalog,
yarn run test

# To run all tests for appifier
yarn run appifier:test
```
