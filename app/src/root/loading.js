import React from 'react';
import PropTypes from 'prop-types';

import grey from 'material-ui/colors/grey';
import { CircularProgress } from 'material-ui/Progress';

import connectComponent from '../helpers/connect-component';

const styles = {
  root: {
    bottom: 0,
    height: 36,
    position: 'fixed',
    right: 0,
    width: 36,
    zIndex: 100,
  },
};

const Loading = (props) => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <CircularProgress size={24} />
    </div>
  );
};

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  Loading,
  null,
  null,
  styles,
);
