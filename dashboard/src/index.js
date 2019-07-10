import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import blue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';
import pink from 'material-ui/colors/pink';

import 'typeface-roboto/index.css';

import './index.css';
import App from './app';
import store from './state';
import registerServiceWorker from './register-service-worker';

import getUrlParameter from './helpers/get-url-parameter';
import { setAuthToken } from './state/root/auth/actions';

const tokenQuery = getUrlParameter('token');
if (tokenQuery) {
  store.dispatch(setAuthToken(tokenQuery));
  if (window.history.replaceState) {
    // prevents browser from storing history with each change:
    window.history.replaceState({}, null, window.location.origin);
  }
}

const theme = createMuiTheme({
  palette: {
    primary: blue, // Purple and green play nicely together.
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
  document.getElementById('root'),
);
registerServiceWorker();
