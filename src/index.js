/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
// to be removed with Electron 11

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'fontsource-roboto/400.css';
import 'fontsource-roboto/500.css';

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
