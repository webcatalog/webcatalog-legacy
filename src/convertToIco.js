// https://raw.githubusercontent.com/jiahaog/nativefier/9243f6689fe1cacc2311ee009bd96b705b32d8ad/src/helpers/convertToIco.js

const shell = require('shelljs');
const path = require('path');

const PNG_TO_ICO_BIN_PATH = path.join(__dirname, 'convertToIco.sh');

console.log(PNG_TO_ICO_BIN_PATH);

const convertToIco = (pngSrc, icoDest, callback) => {
  shell.exec(`${PNG_TO_ICO_BIN_PATH} ${pngSrc} ${icoDest}`, { silent: true }, (exitCode, stdOut, stdError) => {
    if (exitCode) {
      callback({
        stdOut,
        stdError,
      }, pngSrc);
      return;
    }

    callback(null, icoDest);
  });
};

module.exports = convertToIco;
