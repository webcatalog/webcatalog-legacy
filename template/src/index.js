import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import CssBaseline from '@material-ui/core/CssBaseline';

import 'typeface-roboto/index.css';

import store from './state';
import { init as initDialogProxy } from './state/dialog-proxy/actions';

import AppWrapper from './components/app-wrapper';

import getWorkspacesAsList from './helpers/get-workspaces-as-list';

const DialogAbout = React.lazy(() => import('./components/dialog-about'));
const DialogAuth = React.lazy(() => import('./components/dialog-auth'));
const DialogCodeInjection = React.lazy(() => import('./components/dialog-code-injection'));
const DialogCustomUserAgent = React.lazy(() => import('./components/dialog-custom-user-agent'));
const DialogDisplayMedia = React.lazy(() => import('./components/dialog-display-media'));
const DialogEditWorkspace = React.lazy(() => import('./components/dialog-edit-workspace'));
const DialogGoToUrl = React.lazy(() => import('./components/dialog-go-to-url'));
const DialogNotifications = React.lazy(() => import('./components/dialog-notifications'));
const DialogOpenUrlWith = React.lazy(() => import('./components/dialog-open-url-with'));
const DialogPreferences = React.lazy(() => import('./components/dialog-preferences'));
const DialogProxy = React.lazy(() => import('./components/dialog-proxy'));
const Main = React.lazy(() => import('./components/main'));

const App = () => {
  switch (window.mode) {
    case 'about': return <DialogAbout />;
    case 'auth': return <DialogAuth />;
    case 'code-injection': return <DialogCodeInjection />;
    case 'custom-user-agent': return <DialogCustomUserAgent />;
    case 'display-media': return <DialogDisplayMedia />;
    case 'edit-workspace': return <DialogEditWorkspace />;
    case 'go-to-url': return <DialogGoToUrl />;
    case 'notifications': return <DialogNotifications />;
    case 'open-url-with': return <DialogOpenUrlWith />;
    case 'preferences': return <DialogPreferences />;
    case 'proxy': return <DialogProxy />;
    default: return <Main />;
  }
};

const runApp = () => {
  Promise.resolve()
    .then(() => {
      const { remote, webFrame } = window.require('electron');
      webFrame.setVisualZoomLevelLimits(1, 1);
      webFrame.setLayoutZoomLevelLimits(0, 0);

      if (window.mode === 'about') {
        document.title = 'About';
      } else if (window.mode === 'auth') {
        document.title = 'Authentication';
      } else if (window.mode === 'preferences') {
        document.title = 'Preferences';
      } else if (window.mode === 'edit-workspace') {
        const { workspaces } = store.getState();
        const workspaceList = getWorkspacesAsList(workspaces);
        const editWorkspaceId = remote.getGlobal('editWorkspaceId');
        const workspace = workspaces[editWorkspaceId];
        workspaceList.some((item, index) => {
          if (item.id === editWorkspaceId) {
            workspace.order = index;
            return true;
          }
          return false;
        });
        document.title = workspace.name ? `Edit Workspace ${workspace.order + 1} "${workspace.name}"` : `Edit Workspace ${workspace.order + 1}`;
      } else if (window.mode === 'open-url-with') {
        document.title = 'Open Link With';
      } else if (window.mode === 'code-injection') {
        const codeInjectionType = remote.getGlobal('codeInjectionType');
        document.title = `Edit ${codeInjectionType.toUpperCase()} Code Injection`;
      } else if (window.mode === 'code-injection') {
        document.title = 'Sign in';
      } else if (window.mode === 'notifications') {
        document.title = 'Notifications';
      } else if (window.mode === 'display-media') {
        document.title = 'Share your Screen';
      } else if (window.mode === 'custom-user-agent') {
        document.title = 'Edit Custom User Agent';
      } else if (window.mode === 'go-to-url') {
        document.title = 'Go to URL';
      } else if (window.mode === 'proxy') {
        store.dispatch(initDialogProxy());
        document.title = 'Proxy Settings';
      } else {
        document.title = remote.getGlobal('appJson').name;
      }

      if (window.mode !== 'main' && window.mode !== 'menubar') {
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            if (window.preventClosingWindow) {
              return;
            }
            remote.getCurrentWindow().close();
          }
        });
      }
    });

  ReactDOM.render(
    <Provider store={store}>
      <AppWrapper>
        <CssBaseline />
        <React.Suspense fallback={<div />}>
          <App />
        </React.Suspense>
      </AppWrapper>
    </Provider>,
    document.getElementById('app'),
  );
};

runApp();
