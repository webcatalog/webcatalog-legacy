/* global fetch Request Headers */

import getServerUrl from './getServerUrl';

const secureFetch = (path, token) => {
  const request = new Request(
    getServerUrl(path),
    {
      headers: new Headers({
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
      }),
    },
  );

  return fetch(request)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }

      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    });
};

export default secureFetch;
