import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';
import grey from '@material-ui/core/colors/grey';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import {
  STRING_FAILED_TO_CONNECT,
  STRING_FAILED_TO_CONNECT_DESC,
  STRING_TRY_AGAIN,
} from '../../constants/strings';

const styles = {
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
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
        variant="title"
      >
        {STRING_FAILED_TO_CONNECT}
      </Typography>
      <Typography
        align="center"
        className={classes.subheading}
        color="inherit"
        variant="subheading"
      >
        {STRING_FAILED_TO_CONNECT_DESC}
      </Typography>
      <Button
        className={classes.tryAgainButton}
        color="primary"
        onClick={onTryAgainButtonClick}
        variant="raised"
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
