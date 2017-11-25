import React from 'react';
import PropTypes from 'prop-types';

import { MenuItem } from 'material-ui/Menu';
import AppBar from 'material-ui/AppBar';
import blue from 'material-ui/colors/blue';
import common from 'material-ui/colors/common';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import FileDownloadIcon from 'material-ui-icons/FileDownload';
import grey from 'material-ui/colors/grey';
import HelpIcon from 'material-ui-icons/Help';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import InsertChartIcon from 'material-ui-icons/InsertChart';
import List, { ListItemIcon, ListItemText } from 'material-ui/List';
import MenuIcon from 'material-ui-icons/Menu';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import connectComponent from '../../helpers/connect-component';

import FakeTitleBar from '../../shared/fake-title-bar';
import RefreshButton from './refresh-button';

import { open as openDialogAbout } from '../../actions/dialogs/about/actions';
import {
  changeRoute,
} from '../../actions/root/router/actions';

import {
  ROUTE_INSTALLED_APPS,
  ROUTE_TOP_CHARTS,
} from '../../constants/routes';

import {
  STRING_ABOUT,
  STRING_HELP_AND_FEEDBACK,
  STRING_INSTALLED_APPS,
  STRING_MENU,
  STRING_TOP_CHARTS,
} from '../../constants/strings';

import { requestCheckForUpdates } from '../../senders/updater';
import { requestOpenInBrowser } from '../../senders/generic';
import { requestScanInstalledApps } from '../../senders/local';

const {
  fullBlack,
  fullWhite,
  lightBlack,
  lightWhite,
} = common;

const styles = theme => ({
  root: {
    zIndex: 1,
  },
  toolbar: {
    padding: '0 12px',
  },
  title: {
    lineHeight: 1.5,
    padding: '0 16px',
    flex: 1,
    userSelect: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  appBar: {
    zIndex: 1,
  },
  appBarContainer: {
    width: '100%',
  },
  indicator: {
    height: 3,
  },
  list: {
    width: 304,
    flex: 'initial',
  },
  circularProgressContainer: {
    width: '100%',
    top: 100,
    position: 'absolute',
    justifyContent: 'center',
    display: 'flex',
    zIndex: 1,
  },
  circularProgressPaper: {
    width: 32,
    height: 32,
    borderRadius: '100%',
    padding: 6,
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  avatar: {
    margin: 16,
    marginBottom: 8,
    width: 60,
    height: 60,
    fontSize: 28,
    cursor: 'default',
  },
  nameDetails: {
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    margin: 16,
    marginBottom: 16,
    fontSize: 15,
  },
  nameDetailsName: {
    fontWeight: 500,
    color: grey[800],
  },
  nameDetailsEmail: {
    color: grey[600],
  },
  headerDivider: {
    marginBottom: 8,
  },
  menuItem: {
    '&:hover': {
      background: grey[300],
    },
  },
  anonnymousHeaderContainer: {
    background: blue[700],
    height: 56,
  },
  signInAppBar: {
    cursor: 'pointer',
  },
  toolbarSectionContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  toolbarSection: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexBasis: '20%',
  },
  toolbarSectionRight: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row-reverse',
    flexBasis: '20%',
  },
  toolbarSearchContainer: {
    flex: 1,
  },
  toolbarSectionSearch: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: blue[400],
    borderRadius: 2,
    height: 40,
    maxWidth: 480,
    margin: '0 auto',
  },
  toolbarSectionSearchInactive: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  toolbarSectionSearchActive: {
    backgroundColor: fullWhite,
  },
  searchBarText: {
    lineHeight: 1.5,
    padding: '0 4px',
    flex: 1,
    userSelect: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    transform: 'translateY(-1px)',
    fontWeight: 'normal',
    fontSize: 18,
  },
  input: {
    font: 'inherit',
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: fullWhite,
    width: '100%',
    '&:focus': {
      outline: 0,
    },
    '&::placeholder': {
      color: lightWhite,
    },
  },
  inputActive: {
    color: fullBlack,
    '&::placeholder': {
      color: lightBlack,
    },
  },
  searchIcon: {
    paddingLeft: 12,
    paddingRight: 6,
  },
  searchIconActive: {
    fill: lightBlack,
  },
  searchButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class EnhancedAppBar extends React.Component {
  constructor() {
    super();

    this.state = {
      isDrawerOpen: false,
    };

    this.handleToggleDrawer = this.handleToggleDrawer.bind(this);
  }

  componentDidMount() {
    // start checking for installed apps only when the app is loaded.
    requestScanInstalledApps();
    requestCheckForUpdates();
  }

  handleToggleDrawer() {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
  }

  render() {
    const {
      classes,
      onChangeRoute,
      onOpenDialogAbout,
      route,
    } = this.props;

    let routeLabel;
    switch (route) {
      case ROUTE_INSTALLED_APPS:
        routeLabel = STRING_INSTALLED_APPS;
        break;
      default:
        routeLabel = STRING_TOP_CHARTS;
    }

    const drawerElement = (
      <Drawer
        open={this.state.isDrawerOpen}
        onRequestClose={this.handleToggleDrawer}
        onClick={this.handleToggleDrawer}
      >
        <FakeTitleBar />
        <div className={classes.listContainer}>
          <List className={classes.list} disablePadding>
            <MenuItem
              selected={route === ROUTE_TOP_CHARTS}
              button
              onClick={() => onChangeRoute(ROUTE_TOP_CHARTS)}
              className={classes.menuItem}
            >
              <ListItemIcon><InsertChartIcon /></ListItemIcon>
              <ListItemText primary={STRING_TOP_CHARTS} />
            </MenuItem>
            <MenuItem
              selected={route === ROUTE_INSTALLED_APPS}
              button
              onClick={() => onChangeRoute(ROUTE_INSTALLED_APPS)}
            >
              <ListItemIcon><FileDownloadIcon /></ListItemIcon>
              <ListItemText primary={STRING_INSTALLED_APPS} />
            </MenuItem>
            <Divider />
            <MenuItem
              button
              onClick={() => requestOpenInBrowser('https://webcatalog.io/help')}
            >
              <ListItemIcon><HelpIcon /></ListItemIcon>
              <ListItemText primary={STRING_HELP_AND_FEEDBACK} />
            </MenuItem>
            <MenuItem button onClick={onOpenDialogAbout}>
              <ListItemIcon><InfoIcon /></ListItemIcon>
              <ListItemText primary={STRING_ABOUT} />
            </MenuItem>
          </List>
        </div>
      </Drawer>
    );

    const titleElement = (
      <div className={classes.toolbarSection}>
        <IconButton
          color="contrast"
          aria-label={STRING_MENU}
          onClick={() => this.handleToggleDrawer()}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          className={classes.title}
          color="inherit"
          type="title"
        >
          {routeLabel}
        </Typography>
      </div>
    );

    const refreshAction = <RefreshButton />;

    return (
      <div className={classes.root}>
        <FakeTitleBar />
        {drawerElement}
        <AppBar position="static" key="appBar" className={classes.appBar} elevation={3}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.toolbarSectionContainer}>
              {titleElement}
              <div className={classes.toolbarSectionRight}>
                {refreshAction}
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

EnhancedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  route: state.router.route,
});

const actionCreators = {
  changeRoute,
  openDialogAbout,
};

export default connectComponent(
  EnhancedAppBar,
  mapStateToProps,
  actionCreators,
  styles,
);
