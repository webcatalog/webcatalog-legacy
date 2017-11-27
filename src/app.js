import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from './helpers/connect-component';

import { checkForLinuxUpdates } from './actions/root/updater/actions';
import { getVersion } from './actions/root/version/actions';

import DialogAbout from './dialogs/about';
import DialogConfirmUninstallApp from './dialogs/confirm-uninstall-app';
import DialogUpdateMainAppFirst from './dialogs/update-main-app-first';

import EnhancedAppBar from './root/enhanced-app-bar';
import EnhancedSnackBar from './root/enhanced-snackbar';
import UpdaterMessage from './root/updater-message';

import InstalledApps from './pages/installed-apps';
import TopCharts from './pages/top-charts';

import {
  ROUTE_INSTALLED_APPS,
} from './constants/routes';

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
      onCheckForLinuxUpdates,
      onGetVersion,
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
        pageContent = <TopCharts key="topCharts" />;
    }

    return (
      <div className={classes.root}>
        <EnhancedAppBar />
        <UpdaterMessage />
        {pageContent}
        <EnhancedSnackBar />
        <DialogAbout />
        <DialogConfirmUninstallApp />
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
