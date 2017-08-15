/* global ipcRenderer */
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import ErrorIcon from 'material-ui-icons/Error';
import grey from 'material-ui/colors/grey';
import Typography from 'material-ui/Typography';

import {
  STRING_AUTH_REQUIRED,
  STRING_AUTH_REQUIRED_DESC,
  STRING_LOG_IN,
} from '../constants/strings';

const styleSheet = {
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

const RequireLogIn = (props) => {
  const {
    classes,
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
        {STRING_AUTH_REQUIRED}
      </Typography>
      <Typography
        align="center"
        className={classes.subheading}
        color="inherit"
        type="subheading"
      >
        {STRING_AUTH_REQUIRED_DESC}
      </Typography>
      <Button
        raised
        color="primary"
        className={classes.tryAgainButton}
        onClick={() => ipcRenderer.send('log-out')}
      >
        {STRING_LOG_IN}
      </Button>
    </div>
  );
};

RequireLogIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet, { name: 'RequireLogIn' })(RequireLogIn);
