const fetchApi = (endpoint, options = {}) => {
  const { token } = options;

  const hostUrl = window.env.API_URL || 'https://getwebcatalog.com/api';

  const url = `${hostUrl}${endpoint}`;


  if (token) {
    const requestOpts = token !== 'anonnymous' ? {
      headers: new window.Headers({
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
      }),
    } : undefined;

    const request = new window.Request(url, requestOpts);

    return fetch(request);
  }

  return fetch(url);
};

export default fetchApi;
