import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { FocusStyleManager } from '@blueprintjs/core';

import App from './components/App';
import store from './store';
import defaultSettings from './constants/defaultSettings';

import '../shared/styles/main.scss';

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
  const shellInfo = ipcRenderer.sendSync('get-shell-info');
  window.shellInfo = shellInfo;

  document.title = shellInfo.name;

  const rememberLastPage = ipcRenderer.sendSync('get-setting', `behaviors.${shellInfo.id}.rememberLastPage`, defaultSettings.rememberLastPage);
  if (rememberLastPage) {
    const lastPage = ipcRenderer.sendSync('get-setting', `lastPages.${shellInfo.id}`, shellInfo.url);
    startReact(lastPage);
  } else {
    const customHome = ipcRenderer.sendSync('get-setting', `behaviors.${shellInfo.id}.customHome`, defaultSettings.customHome);
    startReact(customHome || shellInfo.url);
  }
};

startApp();
