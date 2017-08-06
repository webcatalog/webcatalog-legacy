import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { blueGrey, darkWhite } from 'material-ui/styles/colors';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import HomeIcon from 'material-ui-icons/Home';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import RefreshIcon from 'material-ui-icons/Refresh';
import SettingsIcon from 'material-ui-icons/Settings';

const styleSheet = createStyleSheet('Navigation', theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: 68,
    padding: theme.spacing.unit,
    boxSizing: 'border-box',
    background: blueGrey[900],
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  innerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  innerContainerEnd: {
    flex: '0 0 auto',
  },
  iconButtonRoot: {
    height: 40,
    width: 40,
    margin: '20px auto 0 auto',
  },
  iconButtonIcon: {
    height: 32,
    width: 32,
    color: darkWhite,
  },
}));

const WebNav = (props) => {
  const { classes } = props;

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <IconButton aria-label="Home" className={classes.iconButtonRoot}>
          <HomeIcon className={classes.iconButtonIcon} />
        </IconButton>
        <IconButton aria-label="Back" className={classes.iconButtonRoot}>
          <KeyboardArrowLeftIcon className={classes.iconButtonIcon} />
        </IconButton>
        <IconButton aria-label="Forward" className={classes.iconButtonRoot}>
          <KeyboardArrowRightIcon className={classes.iconButtonIcon} />
        </IconButton>
        <IconButton aria-label="Refresh" className={classes.iconButtonRoot}>
          <RefreshIcon className={classes.iconButtonIcon} />
        </IconButton>
      </div>

      <div className={classnames(classes.innerContainer, classes.innerContainerEnd)}>
        <IconButton aria-label="Settings" className={classes.iconButtonRoot}>
          <SettingsIcon className={classes.iconButtonIcon} />
        </IconButton>
      </div>
    </div>
  );
};

WebNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(WebNav);
