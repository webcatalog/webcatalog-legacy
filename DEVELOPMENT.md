<!-- https://raw.githubusercontent.com/jiahaog/nativefier/master/docs/development.md -->

# Development
## Environment Setup

```bash
# First, clone the project:
git clone https://github.com/quanglam2807/appifier.git
cd appifier

# install the dependencies
yarn
# build the code
yarn build
# To develop the template Electron app, run
yarn lib:electron-dev
# It'll automatically watch the files for changes and reload accordingly.
# Still, if you modify files in the main process (./app/main),
# you'll need to manually re-run the script.
```

## Tests

```bash
# To run all tests for Appifier GUI
yarn run test
```
