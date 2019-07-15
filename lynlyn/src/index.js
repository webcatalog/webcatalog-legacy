import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import teal from '@material-ui/core/colors/teal';
import pink from '@material-ui/core/colors/pink';

import 'typeface-roboto/index.css';

import './index.css';

import store from './state';

// listeners to communicate with main process
import loadListeners from './listeners';

import App from './components/app';

loadListeners(store);

const runApp = () => {
  const state = store.getState();

  const theme = createMuiTheme({
    palette: {
      type: state.preferences.darkTheme ? 'dark' : 'light',
      primary: {
        light: teal[300],
        main: teal[500],
        dark: teal[700],
      },
      secondary: {
        light: pink[300],
        main: pink[500],
        dark: pink[700],
      },
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
