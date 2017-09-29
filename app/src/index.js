/* global ipcRenderer */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import createMuiTheme from 'material-ui/styles/createMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import blue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';
import pink from 'material-ui/colors/pink';

import './index.css';

import store from './state';

// listeners to communicate with main process
import loadListeners from './listeners';

// senders
import {
  requestReadTokenFromDisk,
} from './senders/auth';

import App from './app';

loadListeners(store);

const runApp = () => {
  const state = store.getState();

  const theme = createMuiTheme({
    breakpoints: {
      values: {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 1200,
        xl: 1440,
      },
    },
    palette: {
      type: state.preferences.darkTheme ? 'dark' : 'light',
      primary: blue, // Purple and green play nicely together.
      accent: pink,
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
};

ipcRenderer.once('set-auth-token', () => {
  runApp();
});

requestReadTokenFromDisk();
