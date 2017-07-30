import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import { isViewingAllApps as isViewingAllAppsSelector } from '../state/ui/routes/selectors';

import AppBar from './AppBar';
import Login from './Login';
import Apps from './Apps';
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

const App = (props) => {
  const {
    classes,
    isLoggedIn,
    isViewingAllApps,
  } = props;

  const appsElement = isViewingAllApps
    ? <Apps key="alls" />
    : <MyApps key="myApps" />;

  return (
    <div className={classes.root}>
      {isLoggedIn ? [
        <AppBar />,
        appsElement,
      ] : <Login />}
      <EnhancedSnackBar />
    </div>
  );
};

App.defaultProps = {
  category: null,
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
  isViewingAllApps: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  category: state.apps.queryParams.category,
  isViewingAllApps: isViewingAllAppsSelector(state),
  isLoggedIn: Boolean(state.auth.token),
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(App));
