import HttpError from './http-error';

export const httpJson = (endpoint, options = {}, requestHeaders = {}) => {
  const getUrl = () => {
    const hostUrl = window.env.API_URL || 'https://getwebcatalog.com/api';
    return `${hostUrl}${endpoint}`;
  };

  const { token } = options;
  if (token) {
    const requestOpts = token !== 'anonnymous' ? {
      headers: new window.Headers({
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
        ...requestHeaders,
      },
      ...options),
    } : undefined;

    const request = new window.Request(getUrl(), requestOpts);

    return fetch(request);
  }

  return fetch(getUrl(), options);
};

export const httpDelete = (url, body = {}, requestHeaders = {}) =>
  httpJson(
    url,
    { method: 'DELETE', body: JSON.stringify(body) },
    requestHeaders,
  );

export const httpGet = (url, requestHeaders = {}) =>
  httpJson(
    url,
    { method: 'GET' },
    requestHeaders,
  );

export const httpPost = (url, body = {}, requestHeaders = {}) =>
  httpJson(
    url,
    { method: 'POST', body: JSON.stringify(body) },
    requestHeaders,
  );

export const httpPatch = (url, body = {}, requestHeaders = {}) =>
  httpJson(
    url,
    { method: 'PATCH', body: JSON.stringify(body) },
    requestHeaders,
  );

export const httpPut = (url, body = {}, requestHeaders = {}) =>
  httpJson(
    url,
    { method: 'PUT', body: JSON.stringify(body) },
    requestHeaders,
  );
