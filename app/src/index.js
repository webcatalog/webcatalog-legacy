/* global */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';

import blue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';
import pink from 'material-ui/colors/pink';

import './index.css';

import store from './state';

import App from './app';

const theme = createMuiTheme({
  palette: createPalette({
    type: 'light', // Switching the dark mode
    primary: blue, // Purple and green play nicely together.
    accent: pink,
    error: red,
  }),
});

document.title = window.shellInfo.name;

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app'),
);
