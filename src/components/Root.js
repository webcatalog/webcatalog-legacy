import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import { getUser } from '../state/main/user/actions';

import DialogAccount from './dialogs/Account';
import DialogAbout from './dialogs/About';
import DialogSubmitApp from './dialogs/SubmitApp';
import DialogConfirmUninstallApp from './dialogs/ConfirmUninstallApp';
import DialogFeedback from './dialogs/Feedback';

import EnhancedAppBar from './main/EnhancedAppBar';
import EnhancedSnackBar from './main/EnhancedSnackbar';

import InstalledApps from './pages/InstalledApps';
import Login from './pages/Login';
import MyApps from './pages/MyApps';
import TopCharts from './pages/TopCharts';
import Search from './pages/Search';

import {
  ROUTE_INSTALLED_APPS,
  ROUTE_MY_APPS,
  ROUTE_SEARCH,
} from '../constants/routes';

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
      onGetUser,
    } = this.props;

    onGetUser();
  }

  render() {
    const {
      classes,
      isLoggedIn,
      route,
    } = this.props;

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
        {isLoggedIn && <EnhancedAppBar />}
        {isLoggedIn && pageContent}
        {!isLoggedIn && <Login />}
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
  route: PropTypes.string.isRequired,
  onGetUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  route: state.router.route,
  isLoggedIn: Boolean(state.auth.token),
});

const mapDispatchToProps = dispatch => ({
  onGetUser: () => dispatch(getUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(App));
