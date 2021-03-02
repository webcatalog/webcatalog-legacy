/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../helpers/connect-component';

import EnhancedBottomNavigation from './root/enhanced-bottom-navigation';
import SnackbarTrigger from './root/snackbar-trigger';
import TelemetryManager from './root/telemetry-manager';

import Installed from './pages/installed';
import Home from './pages/home';
import Preferences from './pages/preferences';
import SignIn from './pages/sign-in';

import DialogAbout from './dialogs/dialog-about';
import DialogCatalogAppDetails from './dialogs/dialog-catalog-app-details';
import DialogChooseEngine from './dialogs/dialog-choose-engine';
import DialogCreateCustomApp from './dialogs/dialog-create-custom-app';
import DialogEditApp from './dialogs/dialog-edit-app';
import DialogLicenseRegistration from './dialogs/dialog-license-registration';
import DialogOpenSourceNotices from './dialogs/dialog-open-source-notices';
import DialogSetInstallationPath from './dialogs/dialog-set-installation-path';
import DialogSetPreferredEngine from './dialogs/dialog-set-preferred-engine';

import {
  ROUTE_PREFERENCES,
  ROUTE_INSTALLED,
} from '../constants/routes';
import {
  requestGetInstalledApps,
  requestCheckForUpdates,
} from '../senders';

import { fetchLatestTemplateVersionAsync } from '../state/general/actions';
import { clearUserState, updateUserAsync } from '../state/user/actions';

import firebase from '../firebase';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
    background: theme.palette.background.default,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  notistackContainerRoot: {
    // substract 22px of FakeTitleBar
    marginTop: window.process.platform === 'darwin' && window.mode !== 'menubar' ? 64 : 42,
  },
});

const App = ({
  classes,
  route,
  onFetchLatestTemplateVersionAsync,
  onClearUserState,
  onUpdateUserAsync,
  isSignedIn,
}) => {
  // docs: https://github.com/firebase/firebaseui-web-react
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        onClearUserState();
        return;
      }

      onUpdateUserAsync();
    });
    // Make sure we un-register Firebase observers when the component unmounts.
    return () => unregisterAuthObserver();
  }, [onClearUserState, onUpdateUserAsync]);

  useEffect(() => {
    requestCheckForUpdates(true); // isSilent = true
    requestGetInstalledApps();

    onFetchLatestTemplateVersionAsync();
    const updaterTimer = setTimeout(() => {
      onFetchLatestTemplateVersionAsync();
    }, 15 * 60 * 1000); // recheck every 15 minutes

    return () => clearTimeout(updaterTimer);
  });

  let pageContent;
  switch (route) {
    case ROUTE_PREFERENCES:
      pageContent = <Preferences key="preferences" />;
      break;
    case ROUTE_INSTALLED:
      pageContent = <Installed key="installed" />;
      break;
    default:
      pageContent = <Home key="home" />;
  }

  return (
    <div className={classes.root}>
      {isSignedIn ? (
        <>
          <div className={classes.content}>
            {pageContent}
          </div>
          <EnhancedBottomNavigation />
        </>
      ) : (
        <SignIn />
      )}

      <SnackbarTrigger />
      <TelemetryManager />

      <DialogAbout />
      <DialogCatalogAppDetails />
      <DialogChooseEngine />
      <DialogCreateCustomApp />
      <DialogEditApp />
      <DialogLicenseRegistration />
      <DialogOpenSourceNotices />
      <DialogSetInstallationPath />
      <DialogSetPreferredEngine />
    </div>
  );
};

App.defaultProps = {
  isSignedIn: false,
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
  isSignedIn: PropTypes.bool,
  onClearUserState: PropTypes.func.isRequired,
  onFetchLatestTemplateVersionAsync: PropTypes.func.isRequired,
  onUpdateUserAsync: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  isFullScreen: state.general.isFullScreen,
  route: state.router.route,
  isSignedIn: state.user.isSignedIn,
});

const actionCreators = {
  fetchLatestTemplateVersionAsync,
  clearUserState,
  updateUserAsync,
};

export default connectComponent(
  App,
  mapStateToProps,
  actionCreators,
  styles,
);
