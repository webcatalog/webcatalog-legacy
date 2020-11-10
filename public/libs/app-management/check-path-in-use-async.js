/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const os = require('os');
const execAsync = require('../exec-async');

// return true if path is in use
// return false if path is NOT in use
const checkPathInUseAsync = (path) => {
  if (process.platform === 'win32') {
    // skip this check on Windows older than 10 (NT 6.x)
    // child_process never stops - powershell - windows 7
    // https://github.com/nodejs/node/issues/25645
    // https://stackoverflow.com/questions/42524606/how-to-get-windows-version-using-node-js
    if (os.release().startsWith('6.')) {
      return Promise.resolve(false);
    }

    // https://stackoverflow.com/a/9476987
    // https://stackoverflow.com/a/61219838
    return execAsync(`get-wmiobject win32_process | ? { $_.Path -ne $null } | ? { $_.Path.Indexof('${path}') -ge 0 } | measure-object | % { $_.Count }`, { shell: 'powershell.exe' })
      .then((stdout) => {
        const processCount = parseInt(stdout, 10);
        if (processCount > 0) {
          return true;
        }
        return false;
      })
      // if the check fails, let's just assume the path is not in use
      .catch(() => false);
  }

  // https://stackoverflow.com/questions/10814293/how-to-check-if-another-instance-of-the-app-binary-is-already-running
  // https://www.cyberciti.biz/tips/grepping-ps-output-without-getting-grep.html
  // https://superuser.com/questions/103309/how-can-i-know-the-absolute-path-of-a-running-process

  // by default, grep EXIT STATUS The exit status is 0
  // if selected lines are found, and 1 if not found
  // "|| true" to force exit code 0
  // https://stackoverflow.com/a/42251542
  return execAsync(`ps -A -ef | grep '${path}' | grep -v -c grep || true`)
    .then((stdout) => {
      const processCount = parseInt(stdout, 10);
      // 1 process is the process that trigger this function
      if (processCount > 1) {
        return true;
      }
      return false;
    })
    // if the check fails, let's just assume the path is not in use
    .catch(() => false);
};

module.exports = checkPathInUseAsync;
