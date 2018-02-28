import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../helpers/connect-component';

import DialogAbout from './dialogs/about';
import DialogConfirmUninstallApp from './dialogs/confirm-uninstall-app';
import DialogCreateCustomApp from './dialogs/create-custom-app';

import FakeTitleBar from './shared/fake-title-bar';
import EnhancedAppBar from './root/enhanced-app-bar';
import EnhancedSnackBar from './root/enhanced-snackbar';
import UpdaterMessage from './root/updater-message';
import DownloadPrompt from './root/download-prompt';

import InstalledApps from './pages/installed-apps';
import Directory from './pages/directory';

import { ROUTE_INSTALLED_APPS } from '../constants/routes';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
  },
};

const App = (props) => {
  const {
    classes,
    chromeInstalled,
    route,
  } = props;

  let pageContent;
  switch (route) {
    case ROUTE_INSTALLED_APPS:
      pageContent = <InstalledApps key="InstalledApps" />;
      break;
    default:
      pageContent = <Directory key="directory" />;
  }

  return (
    <div className={classes.root}>
      <FakeTitleBar />
      {chromeInstalled ? (
        <React.Fragment>
          <EnhancedAppBar />
          <UpdaterMessage />
          {pageContent}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <UpdaterMessage />
          <DownloadPrompt />
        </React.Fragment>
      )}
      <EnhancedSnackBar />
      <DialogAbout />
      <DialogConfirmUninstallApp />
      <DialogCreateCustomApp />
    </div>
  );
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
  chromeInstalled: PropTypes.bool.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  chromeInstalled: state.router.chromeInstalled,
  route: state.router.route,
});


export default connectComponent(
  App,
  mapStateToProps,
  null,
  styles,
);
