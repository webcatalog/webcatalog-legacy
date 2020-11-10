/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import { SnackbarProvider } from 'notistack';
import Button from '@material-ui/core/Button';

import connectComponent from '../helpers/connect-component';

import EnhancedBottomNavigation from './root/enhanced-bottom-navigation';
import SnackbarTrigger from './root/snackbar-trigger';
import TelemetryManager from './root/telemetry-manager';

import Installed from './pages/installed';
import Home from './pages/home';
import Preferences from './pages/preferences';

import DialogAbout from './dialogs/dialog-about';
import DialogCatalogAppDetails from './dialogs/dialog-catalog-app-details';
import DialogChooseEngine from './dialogs/dialog-choose-engine';
import DialogCreateCustomApp from './dialogs/dialog-create-custom-app';
import DialogEditApp from './dialogs/dialog-edit-app';
import DialogLicenseRegistration from './dialogs/dialog-license-registration';
import DialogProxy from './dialogs/dialog-proxy';
import DialogReferral from './dialogs/dialog-referral';
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

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
    background: theme.palette.background.default,
  },
  notistackContainerRoot: {
    // substract 22px of FakeTitleBar
    marginTop: window.process.platform === 'darwin' && window.mode !== 'menubar' ? 64 : 42,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.updaterTimer = null;
  }

  componentDidMount() {
    requestCheckForUpdates(true); // isSilent = true
    requestGetInstalledApps();

    const { onFetchLatestTemplateVersionAsync } = this.props;
    onFetchLatestTemplateVersionAsync();
    this.updaterTimer = setTimeout(() => {
      onFetchLatestTemplateVersionAsync();
    }, 15 * 60 * 1000); // recheck every 15 minutes
  }

  componentWillUnmount() {
    clearTimeout(this.updaterTimer);
  }

  render() {
    const { classes, route } = this.props;
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

    const notistackRef = React.createRef();
    const onClickDismiss = (key) => () => {
      notistackRef.current.closeSnackbar(key);
    };

    return (
      <SnackbarProvider
        ref={notistackRef}
        maxSnack={3}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        dense
        preventDuplicate
        classes={{
          containerRoot: classes.notistackContainerRoot,
        }}
        action={(key) => (
          <Button color="inherit" onClick={onClickDismiss(key)}>
            Dismiss
          </Button>
        )}
      >
        <div className={classes.root}>
          {pageContent}
          <DialogAbout />
          <DialogChooseEngine />
          <DialogCreateCustomApp />
          <DialogEditApp />
          <DialogLicenseRegistration />
          <DialogProxy />
          <DialogSetInstallationPath />
          <DialogSetPreferredEngine />
          <DialogCatalogAppDetails />
          <DialogReferral />
          <EnhancedBottomNavigation />
          <SnackbarTrigger />
          <TelemetryManager />
        </div>
      </SnackbarProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  route: PropTypes.string.isRequired,
  onFetchLatestTemplateVersionAsync: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isFullScreen: state.general.isFullScreen,
  route: state.router.route,
});

const actionCreators = {
  fetchLatestTemplateVersionAsync,
};

export default connectComponent(
  App,
  mapStateToProps,
  actionCreators,
  styles,
);
