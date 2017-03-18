/* eslint-disable comma-dangle */

const path = require('path');

const getElectronPath = () => {
  if (process.platform === 'win32') {
    return path.resolve(
      __dirname,
      '../../node_modules/electron/dist/electron.exe'
    );
  } else if (process.platform === 'darwin') {
    return path.resolve(
      __dirname,
      '../../node_modules/electron/dist/electron.app/Contents/MacOS/electron'
    );
  }

  return path.resolve(
    __dirname,
    '../../node_modules/electron/dist/electron'
  );
};

module.exports = getElectronPath;
