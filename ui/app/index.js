/* global document electronSettings argv */
/* eslint-disable no-console */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { FocusStyleManager } from '@blueprintjs/core';

import App from './components/App';
import store from './store';

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

electronSettings.get('behaviors.rememberLastPage').then((rememberLastPage) => {
  if (rememberLastPage) {
    electronSettings.get(`lastpages.${argv.id}`)
      .then((lastPage) => {
        if (lastPage) startApp(lastPage);
        else startApp(argv.url);
      })
      .catch(() => {
        startApp(argv.url);
      });
  } else {
    startApp(argv.url);
  }
});
