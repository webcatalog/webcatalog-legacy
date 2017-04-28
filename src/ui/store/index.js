import { remote, ipcRenderer } from 'electron';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { FocusStyleManager } from '@blueprintjs/core';

import store from './store';
import renderRoutes from './renderRoutes';
import getAllAppPath from './helpers/getAllAppPath';

import '../shared/styles/main.scss';

// http://blueprintjs.com/docs/#a11y.focus
FocusStyleManager.onlyShowFocusOnTabs();

// log message
ipcRenderer.on('log', (event, message) => {
  /* eslint-disable no-console */
  console.log(message);
  /* eslint-enable no-console */
});

// ensure the folder exists
const allAppPath = getAllAppPath();
if (!remote.require('fs').existsSync(allAppPath)) {
  remote.require('mkdirp').sync(allAppPath);
}

render(
  <Provider store={store}>
    {renderRoutes()}
  </Provider>,
  document.getElementById('app'),
);
