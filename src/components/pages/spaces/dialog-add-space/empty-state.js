/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    marginBottom: 8,
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
      <Icon className={classes.icon} color="disabled" />
      <br />
      {title && (
        <Typography
          className={classes.title}
          variant="h6"
        >
          {title}
        </Typography>
      )}
      {typeof children === 'string' ? (
        <Typography
          variant="subtitle1"
          align="center"
        >
          {children}
        </Typography>
      ) : children}
    </div>
  );
};

EmptyState.defaultProps = {
  children: null,
  title: null,
};

EmptyState.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.string,
  ]),
  classes: PropTypes.object.isRequired,
  icon: PropTypes.object.isRequired,
  title: PropTypes.string,
};

export default withStyles(styles, { name: 'EmptyState' })(EmptyState);
