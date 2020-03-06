const fsExtra = require('fs-extra');

const customizedFetch = require('./customized-fetch');

// https://github.com/node-fetch/node-fetch/issues/375#issuecomment-385751664
const downloadAsync = (
  url, dest, fetchOpts, ...fetchArgs
) => fsExtra.ensureFile(dest)
  .then(() => customizedFetch(url, fetchOpts, ...fetchArgs))
  .then((res) => new Promise((resolve, reject) => {
    const fileStream = fsExtra.createWriteStream(dest);
    res.body.pipe(fileStream);
    res.body.on('error', (err) => {
      reject(err);
    });
    fileStream.on('finish', () => {
      resolve();
    });
  }));

module.exports = downloadAsync;
