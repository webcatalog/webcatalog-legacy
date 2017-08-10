import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import { isViewingAllApps as isViewingAllAppsSelector } from '../state/routes/selectors';
import { getUser } from '../state/user/actions';

import DialogAccount from './dialogs/Account';
import DialogAbout from './dialogs/About';
import DialogSubmitApp from './dialogs/SubmitApp';
import DialogConfirmUninstallApp from './dialogs/ConfirmUninstallApp';
import DialogFeedback from './dialogs/Feedback';

import EnhancedAppBar from './EnhancedAppBar';
import Login from './Login';
import TopCharts from './TopCharts';
import MyApps from './MyApps';
import EnhancedSnackBar from './shared/EnhancedSnackbar';

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
      isViewingAllApps,
    } = this.props;

    const appsElement = isViewingAllApps
      ? <TopCharts key="alls" />
      : <MyApps key="myApps" />;

    return (
      <div className={classes.root}>
        {isLoggedIn && <EnhancedAppBar />}
        {isLoggedIn && appsElement}
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
  isViewingAllApps: PropTypes.bool.isRequired,
  onGetUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isViewingAllApps: isViewingAllAppsSelector(state),
  isLoggedIn: Boolean(state.auth.token),
});

const mapDispatchToProps = dispatch => ({
  onGetUser: () => dispatch(getUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(App));
