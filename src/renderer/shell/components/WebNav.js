import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui-icons/Home';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import { grey } from 'material-ui/styles/colors';
// import Menu, { MenuItem } from 'material-ui/Menu';

import EnhancedMenu from './EnhancedMenu';

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
      <EnhancedMenu>
        <IconButton
          aria-label="More"
          className={classes.iconButtonRoot}
        >
          <MoreVertIcon className={classes.iconButtonIcon} />
        </IconButton>
      </EnhancedMenu>
    </div>
  );
};

WebNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(WebNav);
