const apiRequest = (endpoint, method, body) =>
  (dispatch, getState) => {
    const { token } = getState().auth.token;

    const hostUrl = window.env.API_URL || 'https://getwebcatalog.com/api';

    const url = `${hostUrl}${endpoint}`;

    if (token) {
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

      if (token !== 'anonnymous') headers.Authorization = `JWT ${token}`;

      const opts = {
        method,
        headers: new window.Headers(headers),
      };

      if (body) opts.body = JSON.stringify(body);

      return fetch(url, opts);
    }

    return fetch(url);
  };

export const apiGet = endpoint =>
  dispatch => dispatch(apiRequest(endpoint, 'GET'));

export const apiPost = (endpoint, body) =>
  dispatch => dispatch(apiRequest(endpoint, 'POST', body));

export const apiPatch = (endpoint, body) =>
  dispatch => dispatch(apiRequest(endpoint, 'PATCH', body));
