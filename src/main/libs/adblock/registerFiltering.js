// https://github.com/minbrowser/min/blob/0a07a99415d8670e49c03a6e12d76a427784964e/main/filtering.js
const { session } = require('electron');
const fs = require('fs');
const path = require('path');

const extractDomain = (url) => {
  const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  const domain = matches && matches[1];
  return domain;
};

const registerFiltering = (partitionId) => {
  const { AdBlockClient, FilterOptions } = require('ad-block');

  const filePath = path.join(__dirname, 'easylist+easyprivacy-noelementhiding.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return;

    const client = new AdBlockClient();
    client.parse(data);

    session.fromPartition(`persist:${partitionId}`).webRequest
      .onBeforeRequest((details, callback) => {
        // main request
        if (!(details.url.startsWith('http://') || details.url.startsWith('https://')) || details.resourceType === 'mainFrame') {
          callback({
            cancel: false,
            requestHeaders: details.requestHeaders,
          });
          return;
        }

        if (client.matches(details.url, FilterOptions.script, extractDomain(details.referrer))) {
          callback({
            cancel: true,
            requestHeaders: details.requestHeaders,
          });
          return;
        }

        callback({
          cancel: false,
          requestHeaders: details.requestHeaders,
        });
      });
  });
};

module.exports = registerFiltering;
