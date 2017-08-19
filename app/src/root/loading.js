import React from 'react';
import PropTypes from 'prop-types';

import grey from 'material-ui/colors/grey';
import { CircularProgress } from 'material-ui/Progress';

import connectComponent from '../helpers/connect-component';

const styles = {
  root: {
    backgroundColor: grey[100],
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const Loading = (props) => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <CircularProgress size={50} />
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
