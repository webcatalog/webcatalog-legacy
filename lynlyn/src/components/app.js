import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../helpers/connect-component';

import AppMain from './app-main';
import AppLock from './app-lock';

const App = ({ unlocked }) => {
  if (unlocked) return <AppMain />;
  return <AppLock />;
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
