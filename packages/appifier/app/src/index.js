import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import createMuiTheme from 'material-ui/styles/createMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import blue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';
import pink from 'material-ui/colors/pink';

import 'typeface-roboto/index.css';

import './index.css';

import store from './state';

// listeners to communicate with main process
import loadListeners from './listeners';

import App from './app';

loadListeners(store);

const runApp = () => {
  const state = store.getState();

  const theme = createMuiTheme({
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

runApp();
