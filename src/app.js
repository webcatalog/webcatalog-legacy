import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from './helpers/connect-component';

import { checkForLinuxUpdates } from './actions/root/updater/actions';
import { getUser } from './actions/root/user/actions';
import { getVersion } from './actions/root/version/actions';

import DialogAbout from './dialogs/about';
import DialogAccount from './dialogs/account';
import DialogConfirmUninstallApp from './dialogs/confirm-uninstall-app';
import DialogSubmitApp from './dialogs/submit-app';
import DialogUpdateMainAppFirst from './dialogs/update-main-app-first';

import EnhancedAppBar from './root/enhanced-app-bar';
import EnhancedSnackBar from './root/enhanced-snackbar';
import UpdaterMessage from './root/updater-message';

import InstalledApps from './pages/installed-apps';
import Login from './pages/log-in';
import MyApps from './pages/my-apps';
import TopCharts from './pages/top-charts';
import Search from './pages/search';

import {
  ROUTE_INSTALLED_APPS,
  ROUTE_MY_APPS,
  ROUTE_SEARCH,
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
      isLoggedIn,
      onCheckForLinuxUpdates,
      onGetUser,
      onGetVersion,
    } = this.props;

    if (isLoggedIn) {
      onGetUser();
    }

    if (window.platform === 'linux') {
      onCheckForLinuxUpdates();
    }

    onGetVersion();
  }

  render() {
    const {
      classes,
      shouldShowLogIn,
      route,
    } = this.props;

    if (shouldShowLogIn) {
      return (
        <div className={classes.root}>
          <Login />
          <EnhancedSnackBar />
        </div>
      );
    }

    let pageContent;
    switch (route) {
      case ROUTE_MY_APPS:
        pageContent = <MyApps key="myApps" />;
        break;
      case ROUTE_INSTALLED_APPS:
        pageContent = <InstalledApps key="InstalledApps" />;
        break;
      case ROUTE_SEARCH:
        pageContent = <Search key="Search" />;
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
        <DialogSubmitApp />
        <DialogConfirmUninstallApp />
        <DialogAccount />
        <DialogUpdateMainAppFirst />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onCheckForLinuxUpdates: PropTypes.func.isRequired,
  onGetUser: PropTypes.func.isRequired,
  onGetVersion: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
  shouldShowLogIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.auth.token && state.auth.token !== 'anonymous'),
  route: state.router.route,
  shouldShowLogIn: Boolean(!state.auth.token),
});

const actionCreators = {
  checkForLinuxUpdates,
  getUser,
  getVersion,
};

export default connectComponent(
  App,
  mapStateToProps,
  actionCreators,
  styles,
);
