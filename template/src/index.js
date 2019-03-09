import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import CssBaseline from '@material-ui/core/CssBaseline';

import 'typeface-roboto/index.css';

import store from './state';

import AppWrapper from './components/app-wrapper';
import CodeInjection from './components/code-injection';
import EditWorkspace from './components/edit-workspace';
import OpenUrlWith from './components/open-url-with';
import Preferences from './components/preferences';
import Sidebar from './components/sidebar';

import { getWorkspace } from './senders';

const { remote, webFrame } = window.require('electron');

webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

const runApp = () => {
  let App;
  switch (window.mode) {
    case 'preferences': {
      App = Preferences;
      break;
    }
    case 'edit-workspace': {
      App = EditWorkspace;
      break;
    }
    case 'open-url-with': {
      App = OpenUrlWith;
      break;
    }
    case 'code-injection': {
      App = CodeInjection;
      break;
    }
    default: {
      App = Sidebar;
    }
  }

  if (window.mode === 'preferences') {
    document.title = 'Preferences';
  } else if (window.mode === 'edit-workspace') {
    const workspace = getWorkspace(window.require('electron').remote.getGlobal('editWorkspaceId'));
    document.title = workspace.name ? `Edit Workspace ${workspace.order + 1} "${workspace.name}"` : `Edit Workspace ${workspace.order + 1}`;
  } else if (window.mode === 'open-url-with') {
    document.title = 'Open Link With';
  } else if (window.mode === 'code-injection') {
    const codeInjectionType = window.require('electron').remote.getGlobal('codeInjectionType');
    document.title = `Edit ${codeInjectionType.toUpperCase()} Code Injection`;
  } else {
    document.title = remote.getGlobal('appJson').name;
  }

  ReactDOM.render(
    <Provider store={store}>
      <AppWrapper>
        <CssBaseline />
        <App />
      </AppWrapper>
    </Provider>,
    document.getElementById('app'),
  );
};

runApp();
