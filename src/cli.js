#! /usr/bin/env node
const program = require('commander');

const packageJson = require('../package');

const appifier = require('./index');

program
  .version(packageJson.version)
  .option('--id <value>', 'The ID of the application, which will affect the name of the folder contains the app. Defaults to molecule.')
  .option('--name <value>', 'The name of the application, which will affect strings in titles and the icon. Defaults to Molecule.')
  .option('--url <value>', 'The url to point the application at. Defaults to https://github.com/webcatalog/appifier.')
  .option('--icon <value>', 'The icon path of the application. Defaults to Electron icon.')
  .option('--dest <value>', 'Specifies the destination directory to build the app to, defaults to the current working directory. Defaults to . (current dir).')
  .parse(process.argv);

const id = program.id || 'molecule';
const name = program.opts.name || 'Molecule';
const url = program.url || 'https://github.com/webcatalog/appifier';
const icon = program.icon || null;
const dest = program.dest || '.';

appifier.createAppAsync(id, name, url, icon, dest)
  .then((destPath) => {
    // eslint-disable-next-line
    console.log(`App has been created at ${destPath}`);
  })
  .catch((err) => {
    // eslint-disable-next-line
    console.log(err);
    process.exit(1);
  });
