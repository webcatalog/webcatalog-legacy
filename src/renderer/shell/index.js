import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { FocusStyleManager } from '@blueprintjs/core';

import App from './components/App';
import store from './store';
import '../shared/styles/main.scss';

// http://blueprintjs.com/docs/#a11y.focus
FocusStyleManager.onlyShowFocusOnTabs();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);

document.title = window.shellInfo.name;
