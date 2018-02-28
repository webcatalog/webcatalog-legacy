import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import indigo from 'material-ui/colors/indigo';
import red from 'material-ui/colors/red';
import pink from 'material-ui/colors/pink';

import 'typeface-roboto/index.css';

import './index.css';

import store from './state';

// listeners to communicate with main process
import loadListeners from './listeners';

import App from './components/app';

loadListeners(store);

const theme = createMuiTheme({
  palette: {
    primary: indigo, // Purple and green play nicely together.
    secondary: pink,
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
