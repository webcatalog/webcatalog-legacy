import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import CssBaseline from '@material-ui/core/CssBaseline';

import 'typeface-roboto/index.css';

import store from './state';

import AppWrapper from './components/app-wrapper';
import Sidebar from './components/sidebar';
import Preferences from './components/preferences';
import EditWorkspace from './components/edit-workspace';
import OpenEmailLinkWith from './components/open-email-link-with';

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
    case 'open-email-link-with': {
      App = OpenEmailLinkWith;
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
  } else if (window.mode === 'open-email-link-with') {
    document.title = 'Open Email Link With';
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
