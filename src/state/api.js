/* global ipcRenderer */
const apiRequest = (endpoint, method, body) =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(() => {
        const { token } = getState().auth;

        const hostUrl = window.env.API_URL || 'https://getwebcatalog.com/api';

        const url = `${hostUrl}${endpoint}`;

        if (token) {
          const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          };

          if (token && token !== 'anonnymous') headers.Authorization = `JWT ${token}`;

          const opts = {
            method,
            headers: new window.Headers(headers),
          };

          if (body) opts.body = JSON.stringify(body);

          return fetch(url, opts);
        }

        return fetch(url);
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }

        if (response.status === 401) {
          ipcRenderer.send('log-out');
        }

        const error = new Error(response.statusText);
        error.response = response;
        return Promise.reject(error);
      });

export const apiGet = endpoint =>
  dispatch => dispatch(apiRequest(endpoint, 'GET'));

export const apiPost = (endpoint, body) =>
  dispatch => dispatch(apiRequest(endpoint, 'POST', body));

export const apiPatch = (endpoint, body) =>
  dispatch => dispatch(apiRequest(endpoint, 'PATCH', body));
