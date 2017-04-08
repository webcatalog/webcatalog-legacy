/* global document electronSettings argv remote fs */
/* eslint-disable no-console */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import camelCase from 'lodash.camelcase';

import { FocusStyleManager } from '@blueprintjs/core';

import App from './components/App';
import store from './store';
import defaultSettings from './constants/defaultSettings';

// http://blueprintjs.com/docs/#a11y.focus
FocusStyleManager.onlyShowFocusOnTabs();

const startApp = (url) => {
  console.log(`Starting: ${url}`);
  render(
    <Provider store={store}>
      <App url={url} />
    </Provider>,
    document.getElementById('app'),
  );
};

const rememberLastPage = electronSettings.get(`behaviors.${camelCase(argv.id)}.rememberLastPage`, defaultSettings.rememberLastPage);
if (rememberLastPage) {
  const lastPage = electronSettings.get(`lastPages.${camelCase(argv.id)}`, argv.url);
  if (lastPage) startApp(lastPage);
  else startApp(argv.url);
} else {
  const customHome = electronSettings.get(`behaviors.${camelCase(argv.id)}.customHome`, defaultSettings.customHome);
  if (customHome) startApp(customHome);
  else startApp(argv.url);
}
