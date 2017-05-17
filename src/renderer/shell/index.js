import { ipcRenderer } from 'electron';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { FocusStyleManager } from '@blueprintjs/core';

import App from './components/App';
import store from './store';
import defaultSettings from './constants/defaultSettings';
import getSettingAsync from './libs/getSettingAsync';

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

    getSettingAsync(`behaviors.${shellInfo.id}.rememberLastPage`)
      .then((rememberLastPage) => {
        if (rememberLastPage) {
          getSettingAsync(`lastPages.${shellInfo.id}`, shellInfo.url)
            .then((lastPage) => {
              if (lastPage) startReact(lastPage);
              else startReact(shellInfo.url);
            });
        } else {
          getSettingAsync(`behaviors.${shellInfo.id}.customHome`, defaultSettings.customHome)
            .then((customHome) => {
              if (customHome) startReact(customHome);
              else startReact(shellInfo.url);
            });
        }
      });
  });

  ipcRenderer.send('get-shell-info');
};

startApp();
