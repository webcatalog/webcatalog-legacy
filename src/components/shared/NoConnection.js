import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Button from 'material-ui/Button';
import ErrorIcon from 'material-ui-icons/Error';
import grey from 'material-ui/colors/grey';
import Typography from 'material-ui/Typography';

const styleSheet = createStyleSheet('NoConnection', {
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
});

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
        Failed to Connect to Server
      </Typography>
      <Typography
        align="center"
        className={classes.subheading}
        color="inherit"
        type="subheading"
      >
        WebCatalog can{"'"}t connect to the server. Please check your Internet connection.
      </Typography>
      <Button
        raised
        color="primary"
        className={classes.tryAgainButton}
        onClick={onTryAgainButtonClick}
      >
        Try Again
      </Button>
    </div>
  );
};

NoConnection.propTypes = {
  classes: PropTypes.object.isRequired,
  onTryAgainButtonClick: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(NoConnection);
