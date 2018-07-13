import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../helpers/connect-component';

import AppArgv from './app-argv';
import AppNoArgv from './app-no-argv';
import AppLock from './app-lock';

const App = ({ unlocked }) => {
  if (window.shellInfo.name) {
    if (unlocked) return <AppArgv />;
    return <AppLock />;
  }

  return <AppNoArgv />;
};

App.defaultProps = {
  unlocked: false,
};

App.propTypes = {
  unlocked: PropTypes.bool,
};

const mapStateToProps = state => ({
  unlocked: state.locker.unlocked,
});


export default connectComponent(
  App,
  mapStateToProps,
  null,
  null,
);
