import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import { getUser } from '../../state/user/actions';

import DialogAccount from './dialogs/Account';
import DialogAbout from './dialogs/About';
import DialogSubmitApp from './dialogs/SubmitApp';
import DialogConfirmUninstallApp from './dialogs/ConfirmUninstallApp';
import DialogFeedback from './dialogs/Feedback';

import EnhancedAppBar from './EnhancedAppBar';
import EnhancedSnackBar from '../shared/EnhancedSnackbar';
import InstalledApps from '../InstalledApps';
import Login from '../Login';
import MyApps from '../MyApps';
import TopCharts from '../TopCharts';
import Search from '../Search';

import {
  ROUTE_INSTALLED_APPS,
  ROUTE_MY_APPS,
  ROUTE_SEARCH,
} from '../../constants/routes';

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
