// https://github.com/minbrowser/min/blob/0a07a99415d8670e49c03a6e12d76a427784964e/ext/filterLists/updateeasyList.js
/* downloads the latest version of easyList and easyPrivacy, removes element hiding rules */

const https = require('https');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'easylist+easyprivacy-noelementhiding.txt');

const easyListOptions = {
  hostname: 'easylist.to',
  port: 443,
  path: '/easylist/easylist.txt',
  method: 'GET',
};

const easyprivacyOptions = {
  hostname: 'easylist.to',
  port: 443,
  path: '/easylist/easyprivacy.txt',
  method: 'GET',
};

const makeRequest = (options, callback) => {
  const request = https.request(options, (response) => {
    response.setEncoding('utf8');

    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      callback(data);
    });
  });
  request.end();
};

/* get the filter lists */
makeRequest(easyListOptions, (easyList) => {
  makeRequest(easyprivacyOptions, (easyprivacy) => {
    const data = (easyList + easyprivacy).replace(/.*##.+\n/g, '');

    fs.writeFileSync(filePath, data);
  });
});
