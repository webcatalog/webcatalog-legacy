const fetch = require('node-fetch');

const getServerUrl = require('./getServerUrl');

const secureFetch = (path, token) =>
  fetch(getServerUrl(path), {
    method: 'GET',
    headers: token !== 'anonnymous' ? {
      Accept: 'application/json',
      Authorization: `JWT ${token}`,
    } : null,
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }

      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    });

module.exports = secureFetch;
