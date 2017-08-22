/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const rebuild = require('electron-rebuild').default;

const buildPath = path.join(__dirname, 'app');
const packageJsonPath = path.join(buildPath, 'package.json');

fs.readJson(packageJsonPath)
  .then(({ dependencies }) => {
    const electronVersion = dependencies.electron;

    const opts = {
      buildPath,
      electronVersion,
    };

    console.log(opts);

    return rebuild(opts);
  })
  .then(() => console.info('Rebuild Successful'))
  .catch((e) => {
    console.error("Building modules didn't work!");
    console.error(e);
  });
