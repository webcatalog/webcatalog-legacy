import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../helpers/connect-component';

import FakeTitleBar from './shared/fake-title-bar';
import Locker from './root/locker';

const styles = {
  rootParent: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
};

const AppLock = ({ classes }) => (
  <div className={classes.rootParent}>
    <FakeTitleBar background="-webkit-linear-gradient(top, #ebebeb, #d5d5d5)" />
    <Locker />
  </div>
);

AppLock.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  AppLock,
  null,
  null,
  styles,
);
