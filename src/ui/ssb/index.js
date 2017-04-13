import { remote } from 'electron';
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

const startReact = (url) => {
  render(
    <Provider store={store}>
      <App url={url} />
    </Provider>,
    document.getElementById('app'),
  );
};

const startApp = () => {
  const electronSettings = remote.require('electron-settings');
  const { id, name, url } = remote.getCurrentWindow().appInfo;

  document.title = name;

  const rememberLastPage = electronSettings.get(`behaviors.${camelCase(id)}.rememberLastPage`, defaultSettings.rememberLastPage);
  if (rememberLastPage) {
    const lastPage = electronSettings.get(`lastPages.${camelCase(id)}`, url);
    if (lastPage) startReact(lastPage);
    else startReact(url);
  } else {
    const customHome = electronSettings.get(`behaviors.${camelCase(id)}.customHome`, defaultSettings.customHome);
    if (customHome) startReact(customHome);
    else startReact(url);
  }
};

startApp();
