/* eslint-disable import/no-extraneous-dependencies */

const { app } = require('electron');

const loadPlugins = () => {
  // load plugins
  app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'));
};

module.exports = loadPlugins;
