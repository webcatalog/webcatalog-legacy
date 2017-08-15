import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import { getUser } from './state/root/user/actions';

import DialogAccount from './dialogs/account';
import DialogAbout from './dialogs/about';
import DialogSubmitApp from './dialogs/submit-app';
import DialogConfirmUninstallApp from './dialogs/confirm-uninstall-app';
import DialogFeedback from './dialogs/feedback';

import EnhancedAppBar from './root/enhanced-app-bar';
import EnhancedSnackBar from './root/enhanced-snackbar';

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

const styleSheet = createStyleSheet('App', {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
  },
});

class App extends React.Component {
  componentDidMount() {
    const {
      isLoggedIn,
      onGetUser,
    } = this.props;

    if (isLoggedIn) {
      onGetUser();
    }
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
        {pageContent}
        <EnhancedSnackBar />
        <DialogAbout />
        <DialogSubmitApp />
        <DialogConfirmUninstallApp />
        <DialogAccount />
        <DialogFeedback />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onGetUser: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
  shouldShowLogIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.auth.token && state.auth.token !== 'anonymous'),
  route: state.router.route,
  shouldShowLogIn: Boolean(!state.auth.token),
});

const mapDispatchToProps = dispatch => ({
  onGetUser: () => dispatch(getUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(App));
