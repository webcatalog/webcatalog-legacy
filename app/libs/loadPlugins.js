/* eslint-disable import/no-extraneous-dependencies */

const { app } = require('electron');
const path = require('path');

const FLASH_VERSION = '24.0.0.194';
const WIDEVINECDM_VERSION = '1.4.8.962';

let flashPluginFilename;
switch (process.platform) {
  case 'darwin':
    flashPluginFilename = 'PepperFlashPlayer.plugin';
    break;
  case 'linux':
    flashPluginFilename = 'libpepflashplayer.so';
    break;
  default:
  case 'win32':
    flashPluginFilename = 'pepflashplayer.dll';
    break;
}

let widevineCdmPluginFilename;
switch (process.platform) {
  case 'darwin':
    widevineCdmPluginFilename = 'widevinecdmadapter.plugin';
    break;
  case 'linux':
    widevineCdmPluginFilename = 'libwidevinecdmadapter.so';
    break;
  default:
  case 'win32':
    widevineCdmPluginFilename = 'widevinecdmadapter.dll';
}

const pluginFolder = `plugins/${process.platform}/${process.arch}`;

const loadPlugins = () => {
  // load plugins
  app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, '..', pluginFolder, 'PepperFlash', FLASH_VERSION, flashPluginFilename).replace('app.asar', 'app.asar.unpacked'));
  app.commandLine.appendSwitch('ppapi-flash-version', FLASH_VERSION);

  app.commandLine.appendSwitch('widevine-cdm-path', path.join(__dirname, '..', pluginFolder, 'WidevineCdm', WIDEVINECDM_VERSION, widevineCdmPluginFilename).replace('app.asar', 'app.asar.unpacked'));
  app.commandLine.appendSwitch('widevine-cdm-version', WIDEVINECDM_VERSION);
};

module.exports = loadPlugins;
