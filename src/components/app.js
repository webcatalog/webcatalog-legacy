import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../helpers/connect-component';

import { getVersion } from '../state/root/version/actions';
import { checkForLinuxUpdates } from '../state/root/updater/actions';

import DialogAbout from './dialogs/about';
import DialogConfirmUninstallApp from './dialogs/confirm-uninstall-app';
import DialogCreateCustomApp from './dialogs/create-custom-app';
import DialogPreferences from './dialogs/preferences';
import DialogUpdateMainAppFirst from './dialogs/update-main-app-first';

import EnhancedAppBar from './root/enhanced-app-bar';
import EnhancedSnackBar from './root/enhanced-snackbar';
import UpdaterMessage from './root/updater-message';

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

class App extends React.Component {
  componentDidMount() {
    const {
      onGetVersion,
      onCheckForLinuxUpdates,
    } = this.props;

    if (window.platform === 'linux') {
      onCheckForLinuxUpdates();
    }

    onGetVersion();
  }

  render() {
    const {
      classes,
      route,
    } = this.props;

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
        <EnhancedAppBar />
        <UpdaterMessage />
        {pageContent}
        <EnhancedSnackBar />
        <DialogAbout />
        <DialogConfirmUninstallApp />
        <DialogCreateCustomApp />
        <DialogPreferences />
        <DialogUpdateMainAppFirst />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  onCheckForLinuxUpdates: PropTypes.func.isRequired,
  onGetVersion: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  route: state.router.route,
});

const actionCreators = {
  checkForLinuxUpdates,
  getVersion,
};

export default connectComponent(
  App,
  mapStateToProps,
  actionCreators,
  styles,
);
