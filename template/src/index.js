import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import CssBaseline from '@material-ui/core/CssBaseline';

import 'typeface-roboto/index.css';

import store from './state';

import About from './components/about';
import AppWrapper from './components/app-wrapper';
import Auth from './components/auth';
import CodeInjection from './components/code-injection';
import EditWorkspace from './components/edit-workspace';
import Main from './components/main';
import OpenUrlWith from './components/open-url-with';
import Preferences from './components/preferences';

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
    case 'auth': {
      App = Auth;
      break;
    }
    case 'about': {
      App = About;
      break;
    }
    default: {
      App = Main;
    }
  }

  if (window.mode === 'about') {
    document.title = 'About';
  } else if (window.mode === 'preferences') {
    document.title = 'Preferences';
  } else if (window.mode === 'edit-workspace') {
    const workspace = getWorkspace(window.require('electron').remote.getGlobal('editWorkspaceId'));
    document.title = workspace.name ? `Edit Workspace ${workspace.order + 1} "${workspace.name}"` : `Edit Workspace ${workspace.order + 1}`;
  } else if (window.mode === 'open-url-with') {
    document.title = 'Open Link With';
  } else if (window.mode === 'code-injection') {
    const codeInjectionType = window.require('electron').remote.getGlobal('codeInjectionType');
    document.title = `Edit ${codeInjectionType.toUpperCase()} Code Injection`;
  } else if (window.mode === 'code-injection') {
    document.title = 'Sign in';
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
