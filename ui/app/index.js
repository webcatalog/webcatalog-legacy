/* global document */
import React from 'react';
import { render } from 'react-dom';

import { FocusStyleManager } from '@blueprintjs/core';

import App from './components/App';

// http://blueprintjs.com/docs/#a11y.focus
FocusStyleManager.onlyShowFocusOnTabs();

render(
  <App />,
  document.getElementById('app'),
);
