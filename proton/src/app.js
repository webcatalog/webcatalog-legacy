import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from './helpers/connect-component';

import { getUser } from './state/root/user/actions';

import DialogAbout from './dialogs/about';
import DialogSubmitApp from './dialogs/submit-app';

import EnhancedAppBar from './root/enhanced-app-bar';
import EnhancedSnackBar from './root/enhanced-snackbar';
import WorkspacesBar from './root/workspaces-bar';
import UpdaterMessage from './root/updater-message';

import Login from './pages/log-in';
import TopCharts from './pages/top-charts';
import Search from './pages/search';

import {
  ROUTE_SEARCH,
} from './constants/routes';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
  },
  rightContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
};

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
      case ROUTE_SEARCH:
        pageContent = <Search key="Search" />;
        break;
      default:
        pageContent = <TopCharts key="topCharts" />;
    }

    return (
      <div className={classes.root}>
        <WorkspacesBar />
        <div className={classes.rightContainer}>
          <EnhancedAppBar />
          <UpdaterMessage />
          {pageContent}
          <EnhancedSnackBar />
          <DialogAbout />
          <DialogSubmitApp />
        </div>
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

const actionCreators = {
  getUser,
};

export default connectComponent(
  App,
  mapStateToProps,
  actionCreators,
  styles,
);
