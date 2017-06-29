import React from 'react';
import PropTypes from 'prop-types';

import { grey } from 'material-ui/styles/colors';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import HomeIcon from 'material-ui-icons/Home';
import IconButton from 'material-ui/IconButton';

import MoreMenuButton from './MoreMenuButton';

const styleSheet = createStyleSheet('WebNav', theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    padding: theme.spacing.unit,
    boxSizing: 'border-box',
    borderTop: `1px solid ${grey[500]}`,
  },
  iconButtonRoot: {
    height: 28,
    width: 28,
  },
  iconButtonIcon: {
    height: 20,
    width: 20,
  },
}));

const WebNav = (props) => {
  const { classes } = props;

  return (
    <div className={classes.container}>
      <IconButton aria-label="Home" className={classes.iconButtonRoot}>
        <HomeIcon className={classes.iconButtonIcon} />
      </IconButton>
      <MoreMenuButton
        iconButtonClassName={classes.iconButtonRoot}
        iconClassName={classes.iconButtonIcon}
      />
    </div>
  );
};

WebNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(WebNav);
