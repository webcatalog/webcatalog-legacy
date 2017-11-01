// https://raw.githubusercontent.com/jiahaog/nativefier/9243f6689fe1cacc2311ee009bd96b705b32d8ad/src/helpers/convertToIco.js

const shell = require('shelljs');
const path = require('path');

const PNG_TO_ICO_BIN_PATH = path.join(__dirname, 'convertToIco.sh');

const convertToIco = (pngSrc, icoDest) =>
  new Promise((resolve, reject) => {
    shell.exec(`${PNG_TO_ICO_BIN_PATH} ${pngSrc} ${icoDest}`, { silent: true }, (exitCode, stdOut, stdError) => {
      if (exitCode) {
        reject(new Error(stdError));
        return;
      }

      resolve(icoDest);
    });
  });

module.exports = convertToIco;
