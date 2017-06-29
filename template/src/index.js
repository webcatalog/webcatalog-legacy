/* global XMLHttpRequest Response */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import { blue, red, pink } from 'material-ui/styles/colors';

import './index.css';

import store from './reducers';

import App from './components/App';

const fetchLocal = url =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      resolve(new Response(xhr.responseText, { status: xhr.status }));
    };
    xhr.onerror = () => {
      reject(new TypeError('Local request failed'));
    };
    xhr.open('GET', url);
    xhr.send(null);
  });

fetchLocal('./webApp.json')
  .then(res => res.json())
  .then((shellInfo) => {
    window.shellInfo = shellInfo;

    const theme = createMuiTheme({
      palette: createPalette({
        type: 'dark', // Switching the dark mode
        primary: blue, // Purple and green play nicely together.
        accent: pink,
        error: red,
      }),
    });

    ReactDOM.render(
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </Provider>,
      document.getElementById('app'),
    );
  });
