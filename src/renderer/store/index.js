import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import { blue, red, pink } from 'material-ui/styles/colors';

import 'typeface-roboto/index.css';

import '../shared.css';

import store from './reducers';

import App from './components/App';

const theme = createMuiTheme({
  palette: createPalette({
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
