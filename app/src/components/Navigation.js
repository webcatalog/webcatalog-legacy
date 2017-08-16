import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { amber, blue, red, green, grey, darkWhite } from 'material-ui/styles/colors';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Paper from 'material-ui/Paper';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import RefreshIcon from 'material-ui-icons/Refresh';
import HomeIcon from 'material-ui-icons/Home';

import EnhancedMenu from './shared/EnhancedMenu';
import { open as openDialogSettings } from '../state/dialogs/settings/actions';

const styleSheet = createStyleSheet('Navigation', theme => ({
  button: {
    border: `3px solid ${amber[500]}`,
    backgroundColor: grey[300],
    boxShadow: 'none',
    fontSize: 20,
    fontWeight: 400,
    width: 48,
    height: 48,
    marginTop: 20,
  },
  buttonBlue: {
    borderColor: blue[500],
  },
  buttonRed: {
    borderColor: red[500],
  },
  buttonGreen: {
    borderColor: green[500],
  },
  buttonAmber: {
    borderColor: amber[500],
  },
  container: {
    zIndex: 1,
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: 56,
    padding: theme.spacing.unit,
    paddingTop: 18,
    boxSizing: 'border-box',
    background: grey[800],
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  containerVert: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    padding: '0 4px',
    // borderBottom: `1px solid ${grey[800]}`,
  },
  innerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  innerContainerVert: {
    flexDirection: 'row',
    alignItems: 'initial',
  },
  innerContainerEnd: {
    flex: '0 0 auto',
  },
  innerContainerEndVert: {
    flex: '0 0 auto',
    alignItems: 'flex-end',
  },
  iconButtonRoot: {
    height: 24,
    width: 24,
    margin: '20px auto 0 auto',
  },
  iconButtonIcon: {
    height: 32,
    width: 32,
    color: darkWhite,
  },
  hiddenMenuItem: {
    display: 'none',
  },
  menuItem: {
    cursor: 'pointer',
  },
}));

const Workspaces = (props) => {
  const {
    vert,
    classes,
    onOpenDialogSettings,
  } = props;

  return (
    <Paper elevation={2} className={classnames(classes.container, vert && classes.containerVert)}>
      <div className={classnames(classes.innerContainer, vert && classes.innerContainerVert)}>
        <IconButton aria-label="Home">
          <HomeIcon />
        </IconButton>
        <IconButton aria-label="Back">
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton aria-label="Forward">
          <KeyboardArrowRightIcon />
        </IconButton>
        <IconButton aria-label="Refresh">
          <RefreshIcon />
        </IconButton>
      </div>

      <div className={classnames(classes.innerContainerEnd, classes.innerContainerEndVert)}>
        <EnhancedMenu
          id="filterMenuButton"
          buttonElement={(
            <IconButton
              aria-label="Filter"
            >
              <MoreVertIcon />
            </IconButton>
          )}
        >
          <MenuItem
            className={classes.hiddenMenuItem}
            selected
          />
          <MenuItem
            className={classes.menuItem}
            key="settings"
            onClick={() => onOpenDialogSettings()}
          >
            App settings
          </MenuItem>
          <MenuItem
            className={classes.menuItem}
            key="findInPage"
            onClick={() => {}}
          >
            Find in page
          </MenuItem>
          <MenuItem
            className={classes.menuItem}
            key="clearBrowsingData"
            onClick={() => {}}
          >
            Clear browsing data
          </MenuItem>
        </EnhancedMenu>
      </div>
    </Paper>
  );
};

Workspaces.defaultProps = {
  vert: false,
};

Workspaces.propTypes = {
  classes: PropTypes.object.isRequired,
  vert: PropTypes.bool,
  onOpenDialogSettings: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onOpenDialogSettings: () => dispatch(openDialogSettings()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Workspaces));
