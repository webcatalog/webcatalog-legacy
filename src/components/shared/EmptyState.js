import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import grey from 'material-ui/colors/grey';

const styleSheet = createStyleSheet('EmptyState', {
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    color: grey[600],
  },
  icon: {
    height: 112,
    width: 112,
  },
});

const EmptyState = (props) => {
  const {
    classes,
    Icon,
    children,
  } = props;

  return (
    <div className={classes.root}>
      <Icon className={classes.icon} color={grey[400]} />
      <br />
      <Typography
        className={classes.title}
        color="inherit"
        type="subheading"
      >
        {children}
      </Typography>
    </div>
  );
};

EmptyState.propTypes = {
  classes: PropTypes.object.isRequired,
  Icon: PropTypes.element.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

export default withStyles(styleSheet)(EmptyState);
