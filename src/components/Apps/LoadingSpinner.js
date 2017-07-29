import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Fade from 'material-ui/transitions/Fade';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('App', {
  circularProgressContainer: {
    width: '100%',
    top: 100,
    position: 'absolute',
    justifyContent: 'center',
    display: 'flex',
    zIndex: 1,
  },
  circularProgressPaper: {
    width: 32,
    height: 32,
    borderRadius: '100%',
    padding: 6,
  },
});

const LoadingSpinner = (props) => {
  const {
    classes,
    isGetting,
  } = props;

  return (
    <Fade in={isGetting}>
      <div className={classes.circularProgressContainer}>
        <Paper className={classes.circularProgressPaper} elevation={10}>
          <CircularProgress size={32} />
        </Paper>
      </div>
    </Fade>
  );
};

LoadingSpinner.defaultProps = {
};

LoadingSpinner.propTypes = {
  classes: PropTypes.object.isRequired,
  isGetting: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isGetting: state.apps.isGetting,
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(LoadingSpinner));
