import React from 'react';
import PropTypes from 'prop-types';

import grey from 'material-ui/colors/grey';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = {
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
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
};

const EmptyState = (props) => {
  const {
    children,
    classes,
    icon,
    title,
  } = props;

  const Icon = icon;

  return (
    <div className={classes.root}>
      <Icon className={classes.icon} color={grey[400]} />
      <br />
      {title && (
        <Typography
          className={classes.title}
          color="inherit"
          type="title"
        >
          {title}
        </Typography>
      )}
      <Typography
        className={classes.subheading}
        color="inherit"
        type="subheading"
      >
        {children}
      </Typography>
    </div>
  );
};

EmptyState.defaultProps = {
  title: null,
};

EmptyState.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  classes: PropTypes.object.isRequired,
  icon: PropTypes.element.isRequired,
  title: PropTypes.string,
};

export default withStyles(styles, { name: 'EmptyState' })(EmptyState);
