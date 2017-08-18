/* global ipcRenderer */
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

// listeners to communicate with main process
import loadListeners from './load-listeners';

// senders
import {
  requestReadTokenFromDisk,
} from './senders/auth';

import App from './app';

loadListeners(store);

const theme = createMuiTheme({
  palette: createPalette({
    primary: blue, // Purple and green play nicely together.
    accent: pink,
    error: red,
  }),
});

ipcRenderer.once('set-auth-token', () => {
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app'),
  );
});

requestReadTokenFromDisk();
