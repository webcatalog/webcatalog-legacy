const { exec } = require('child_process');

// return true if path is in use
// return false if path is NOT in use
const checkPathInUseAsync = (path) => {
  if (process.platform === 'win32') return Promise.resolve(false);

  return new Promise((resolve, reject) => {
    // https://stackoverflow.com/questions/10814293/how-to-check-if-another-instance-of-the-app-binary-is-already-running
    // https://www.cyberciti.biz/tips/grepping-ps-output-without-getting-grep.html
    // https://superuser.com/questions/103309/how-can-i-know-the-absolute-path-of-a-running-process

    // by default, grep EXIT STATUS The exit status is 0 
    // if selected lines are found, and 1 if not found
    // "|| true" to force exit code 0
    // https://stackoverflow.com/a/42251542
    exec(`ps -A -ef | grep "${path}" | grep -v -c grep || true`, (e, stdout, stderr) => {
      if (e instanceof Error) {
        return reject(e);
      }

      if (stderr) {
        return reject(new Error(stderr));
      }

      const processCount = parseInt(stdout, 10);
      // 1 process is the process that trigger this function
      if (processCount > 1) {
        return resolve(true);
      }
      return resolve(false);
    });
  });
};

module.exports = checkPathInUseAsync;
