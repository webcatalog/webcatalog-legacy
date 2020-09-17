const { exec } = require('child_process');

// return true if path is in use
// return false if path is NOT in use
const checkPathInUseAsync = (path) => {
  if (process.platform === 'win32') return Promise.resolve(false);

  return new Promise((resolve, reject) => {
    // https://stackoverflow.com/questions/10814293/how-to-check-if-another-instance-of-the-app-binary-is-already-running
    // https://www.cyberciti.biz/tips/grepping-ps-output-without-getting-grep.html
    exec(`ps -A | grep "${path}" | grep -v -c grep`, (e, stdout, stderr) => {
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
