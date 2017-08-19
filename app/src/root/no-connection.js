import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import ErrorIcon from 'material-ui-icons/Error';
import grey from 'material-ui/colors/grey';
import Typography from 'material-ui/Typography';

import {
  STRING_FAILED_TO_CONNECT,
  STRING_FAILED_TO_CONNECT_DESC,
  STRING_TRY_AGAIN,
} from '../constants/strings';

const styles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: grey[300],
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    color: grey[600],
    marginBottom: 8,
  },
  subheading: {
    color: grey[600],
  },
  icon: {
    height: 112,
    width: 112,
  },
  tryAgainButton: {
    marginTop: 16,
  },
};

const NoConnection = (props) => {
  const {
    classes,
    onTryAgainButtonClick,
  } = props;

  return (
    <div className={classes.root}>
      <ErrorIcon className={classes.icon} color={grey[400]} />
      <br />
      <Typography
        className={classes.title}
        color="inherit"
        type="title"
      >
        {STRING_FAILED_TO_CONNECT}
      </Typography>
      <Typography
        align="center"
        className={classes.subheading}
        color="inherit"
        type="subheading"
      >
        {STRING_FAILED_TO_CONNECT_DESC}
      </Typography>
      <Button
        raised
        color="primary"
        className={classes.tryAgainButton}
        onClick={onTryAgainButtonClick}
      >
        {STRING_TRY_AGAIN}
      </Button>
    </div>
  );
};

NoConnection.propTypes = {
  classes: PropTypes.object.isRequired,
  onTryAgainButtonClick: PropTypes.func.isRequired,
};

export default withStyles(styles, { name: 'NoConnection' })(NoConnection);
