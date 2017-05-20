import { ipcRenderer } from 'electron';
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
  ipcRenderer.once('shell-info', (e, shellInfo) => {
    window.shellInfo = shellInfo;

    document.title = shellInfo.name;

    const rememberLastPage = ipcRenderer.sendSync('get-setting', `behaviors.${shellInfo.id}.rememberLastPage`);
    if (rememberLastPage) {
      const lastPage = ipcRenderer.sendSync('get-setting', `lastPages.${shellInfo.id}`, shellInfo.url);
      if (lastPage) startReact(lastPage);
      else startReact(shellInfo.url);
    } else {
      const customHome = ipcRenderer.sendSync('get-setting', `behaviors.${shellInfo.id}.customHome`, defaultSettings.customHome);
      if (customHome) startReact(customHome);
      else startReact(shellInfo.url);
    }
  });

  ipcRenderer.send('get-shell-info');
};

startApp();
