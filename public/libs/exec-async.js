const { exec } = require('child_process');

const execAsync = (cmd, opts = {}) => new Promise((resolve, reject) => {
  exec(cmd, opts, (e, stdout, stderr) => {
    if (e instanceof Error) {
      reject(e);
      return;
    }

    if (stderr) {
      reject(new Error(stderr));
      return;
    }

    resolve(stdout);
  });
});

module.exports = execAsync;
