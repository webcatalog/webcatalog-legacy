import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import teal from 'material-ui/colors/teal';
import red from 'material-ui/colors/red';

import 'typeface-roboto/index.css';

import './index.css';

import store from './state';

// listeners to communicate with main process
import loadListeners from './listeners';

import App from './app';

loadListeners(store);

const theme = createMuiTheme({
  palette: {
    primary: teal, // Purple and green play nicely together.
    secondary: red,
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
