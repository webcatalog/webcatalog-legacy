import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import grey from 'material-ui/colors/grey';
import red from 'material-ui/colors/red';
import deepPurple from 'material-ui/colors/deepPurple';

import 'typeface-roboto/index.css';

import './index.css';

import store from './state';

// listeners to communicate with main process
import loadListeners from './listeners';

import App from './components/app';

loadListeners(store);

const customGrey = Object.assign({}, grey, {
  900: '#000',
  800: '#000',
  700: '#000',
  600: '#000',
  500: grey[900],
  400: grey[800],
  300: grey[700],
  200: grey[600],
  100: grey[500],
});

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: customGrey, // Purple and green play nicely together.
    secondary: deepPurple,
    error: red,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app'),
);
