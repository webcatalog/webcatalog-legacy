import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'typeface-roboto/index.css';

import './amplitude';

import './index.css';

import store from './state';

// listeners to communicate with main process
import loadListeners from './listeners';

import AppWrapper from './components/app-wrapper';

loadListeners(store);

ReactDOM.render(
  <Provider store={store}>
    <AppWrapper />
  </Provider>,
  document.getElementById('app'),
);
