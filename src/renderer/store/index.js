import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { FocusStyleManager } from '@blueprintjs/core';

import store from './store';

import App from './components/App';

import '../shared/styles/main.scss';

// http://blueprintjs.com/docs/#a11y.focus
FocusStyleManager.onlyShowFocusOnTabs();

// disable zoom
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

// log message
ipcRenderer.on('log', (event, message) => {
  /* eslint-disable no-console */
  console.log(message);
  /* eslint-enable no-console */
});

render(
  <Provider store={store}>
    {<App />}
  </Provider>,
  document.getElementById('app'),
);
