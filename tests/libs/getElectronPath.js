/* eslint-disable comma-dangle */

const path = require('path');

const getElectronPath = () => {
  if (process.platform === 'win32') {
    return path.resolve(
      __dirname,
      '../../dist/win-unpacked/WebCatalog.exe'
    );
  } else if (process.platform === 'darwin') {
    return path.resolve(
      __dirname,
      '../../dist/mac/WebCatalog.app/Contents/MacOS/WebCatalog'
    );
  }

  return path.resolve(
    __dirname,
    '../../dist/linux-unpacked/webcatalog'
  );
};

module.exports = getElectronPath;
