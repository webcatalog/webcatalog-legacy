// https://raw.githubusercontent.com/jiahaog/nativefier/9243f6689fe1cacc2311ee009bd96b705b32d8ad/src/helpers/convertToIcns.js

const shell = require('shelljs');
const path = require('path');

const PNG_TO_ICNS_BIN_PATH = path.join(__dirname, 'convertToIcns.sh');

const convertToIcns = (pngSrc, icnsDest) =>
  new Promise((resolve, reject) => {
    shell.exec(`${PNG_TO_ICNS_BIN_PATH} ${pngSrc} ${icnsDest}`, { silent: true }, (exitCode, stdOut, stdError) => {
      if (stdOut.includes('icon.iconset:error') || exitCode) {
        if (exitCode) {
          reject(new Error(stdError));
          return;
        }

        reject(stdOut);
        return;
      }

      resolve(icnsDest);
    });
  });

module.exports = convertToIcns;
