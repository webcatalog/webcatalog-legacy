/* global document electronSettings argv remote fs */
/* eslint-disable no-console */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import camelCase from 'lodash.camelcase';

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

// handle url protocol
const rURLFile = `${remote.app.getPath('home')}/.webcatalog/${argv.id}.rurl`;
console.log(rURLFile);
if (fs.existsSync(rURLFile)) {
  const requestedURL = fs.readFileSync(rURLFile, 'utf8').trim();
  fs.unlink(rURLFile, () => {});
  startApp(requestedURL);
} else {
  electronSettings.get(`behaviors.${camelCase(argv.id)}.rememberLastPage`).then((rememberLastPage) => {
    if (rememberLastPage) {
      electronSettings.get(`lastPages.${camelCase(argv.id)}`)
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
}
