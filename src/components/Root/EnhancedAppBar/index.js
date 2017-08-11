/* global ipcRenderer */
import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PowerSettingsNewIcon from 'material-ui-icons/PowerSettingsNew';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import AddBoxIcon from 'material-ui-icons/AddBox';
import FeedbackIcon from 'material-ui-icons/Feedback';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import InsertChartIcon from 'material-ui-icons/InsertChart';
import FileDownloadIcon from 'material-ui-icons/FileDownload';
import LocalOfferIcon from 'material-ui-icons/LocalOffer';
import Divider from 'material-ui/Divider';
import HelpIcon from 'material-ui-icons/Help';
import Avatar from 'material-ui/Avatar';
import InfoIcon from 'material-ui-icons/Info';
import PublicIcon from 'material-ui-icons/Public';
import { MenuItem } from 'material-ui/Menu';
import List, { ListItemIcon, ListItemText } from 'material-ui/List';
import SearchIcon from 'material-ui-icons/Search';
import MenuIcon from 'material-ui-icons/Menu';
import Drawer from 'material-ui/Drawer';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import grey from 'material-ui/colors/grey';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import FakeTitleBar from '../../shared/FakeTitleBar';
import RefreshButton from './RefreshButton';
import SearchBox from './SearchBox';

import { changeRoute } from '../../../state/router/actions';
import { open as openDialogAccount } from '../../../state/dialogs/account/actions';
import { open as openDialogFeedback } from '../../../state/dialogs/feedback/actions';
import { open as openDialogAbout } from '../../../state/dialogs/about/actions';
import { open as openDialogSubmitApp } from '../../../state/dialogs/submit-app/actions';
import {
  ROUTE_INSTALLED_APPS,
  ROUTE_MY_APPS,
  ROUTE_SEARCH,
  ROUTE_TOP_CHARTS,
} from '../../../constants/routes';

const title = {
  lineHeight: 1.5,
  padding: '0 16px',
  flex: 1,
  userSelect: 'none',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};
const styleSheet = createStyleSheet('EnhancedAppBar', {
  root: {
    zIndex: 1,
  },
  toolbar: {
    padding: '0 12px',
  },
  title,
  appBar: {
    zIndex: 1,
  },
  appBarContainer: {
    width: '100%',
    // marginTop: -24,
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
});

class EnhancedAppBar extends React.Component {
  constructor() {
    super();

    this.state = {
      isDrawerOpen: false,
    };

    this.handleToggleDrawer = this.handleToggleDrawer.bind(this);
    this.handleOpenDialogAccount = this.handleOpenDialogAccount.bind(this);
    this.handleOpenDialogAbout = this.handleOpenDialogAbout.bind(this);
    this.handleOpenDialogSubmitApp = this.handleOpenDialogSubmitApp.bind(this);
  }

  componentDidMount() {
    // start checking for installed apps only when the app is loaded.
    ipcRenderer.send('scan-installed-apps');
    ipcRenderer.send('check-for-updates');
  }

  handleToggleDrawer() {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
  }

  handleOpenDialogAccount() {
    this.props.onOpenDialogAccount();
  }

  handleOpenDialogAbout() {
    this.props.onOpenDialogAbout();
  }

  handleOpenDialogSubmitApp() {
    this.props.onOpenDialogSubmitApp();
  }

  render() {
    const {
      classes,
      displayName,
      email,
      onChangeRoute,
      onOpenDialogFeedback,
      profilePicture,
      route,
    } = this.props;

    let routeLabel;
    switch (route) {
      case ROUTE_INSTALLED_APPS:
        routeLabel = 'Installed Apps';
        break;
      case ROUTE_MY_APPS:
        routeLabel = 'My Apps';
        break;
      default:
        routeLabel = 'Top Charts';
    }

    const temp = (
      <div className={classes.headerContainer}>
        <Avatar
          alt={displayName}
          src={profilePicture}
          className={classes.avatar}
        />
        <div className={classes.nameDetails}>
          <div className={classes.nameDetailsName}>
            {displayName}
          </div>
          <div className={classes.nameDetailsEmail}>
            {email}
          </div>
        </div>
      </div>
    );

    return (
      <div className={classes.root}>
        <FakeTitleBar />
        <Drawer
          open={this.state.isDrawerOpen}
          onRequestClose={this.handleToggleDrawer}
          onClick={this.handleToggleDrawer}
        >
          <FakeTitleBar isColorDisabled />
          <div className={classes.listContainer}>
            <List className={classes.list} disablePadding>
              {temp}
              <Divider />
              <MenuItem
                selected={route === ROUTE_TOP_CHARTS}
                button
                onClick={() => onChangeRoute(ROUTE_TOP_CHARTS)}
                className={classes.menuItem}
              >
                <ListItemIcon><InsertChartIcon /></ListItemIcon>
                <ListItemText primary="Top Charts" />
              </MenuItem>
              <MenuItem
                button
                onClick={() => onChangeRoute(ROUTE_INSTALLED_APPS)}
              >
                <ListItemIcon><FileDownloadIcon /></ListItemIcon>
                <ListItemText primary="Installed Apps" />
              </MenuItem>
              <MenuItem
                selected={route === ROUTE_MY_APPS}
                button
                onClick={() => onChangeRoute(ROUTE_MY_APPS)}
                className={classes.menuItem}
              >
                <ListItemIcon><LocalOfferIcon /></ListItemIcon>
                <ListItemText primary="My Apps" />
              </MenuItem>
              <Divider />
              <MenuItem button onClick={this.handleOpenDialogAccount}>
                <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                <ListItemText primary="Account" />
              </MenuItem>
              <MenuItem button onClick={this.handleOpenDialogSubmitApp}>
                <ListItemIcon><AddBoxIcon /></ListItemIcon>
                <ListItemText primary="Submit App" />
              </MenuItem>
              <MenuItem button onClick={() => ipcRenderer.send('log-out')}>
                <ListItemIcon><PowerSettingsNewIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
              <Divider />
              <MenuItem
                button
                onClick={() => ipcRenderer.send('open-in-browser', 'https://getwebcatalog.com/help')}
              >
                <ListItemIcon><HelpIcon /></ListItemIcon>
                <ListItemText primary="Help" />
              </MenuItem>
              <MenuItem
                button
                onClick={onOpenDialogFeedback}
              >
                <ListItemIcon><FeedbackIcon /></ListItemIcon>
                <ListItemText primary="Send Feedback" />
              </MenuItem>
              <MenuItem
                button
                onClick={() => ipcRenderer.send('open-in-browser', 'https://getwebcatalog.com')}
              >
                <ListItemIcon><PublicIcon /></ListItemIcon>
                <ListItemText primary="Website" />
              </MenuItem>
              <MenuItem button onClick={this.handleOpenDialogAbout}>
                <ListItemIcon><InfoIcon /></ListItemIcon>
                <ListItemText primary="About" />
              </MenuItem>
            </List>
          </div>
        </Drawer>
        <SearchBox />
        <AppBar position="static" key="appBar" className={classes.appBar} elevation={3}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              color="contrast"
              aria-label="Menu"
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
            <IconButton
              color="contrast"
              aria-label="Search"
              onClick={() => onChangeRoute(ROUTE_SEARCH)}
            >
              <SearchIcon />
            </IconButton>
            <RefreshButton />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

EnhancedAppBar.defaultProps = {
  category: null,
  displayName: null,
  email: null,
  profilePicture: null,
};

EnhancedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  displayName: PropTypes.string,
  email: PropTypes.string,
  route: PropTypes.string.isRequired,
  profilePicture: PropTypes.string,
  onChangeRoute: PropTypes.func.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogAccount: PropTypes.func.isRequired,
  onOpenDialogFeedback: PropTypes.func.isRequired,
  onOpenDialogSubmitApp: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  displayName: state.user.apiData.displayName,
  email: state.user.apiData.email,
  isLoggedIn: Boolean(state.auth.token),
  route: state.router.route,
  profilePicture: state.user.apiData.profilePicture,
});

const mapDispatchToProps = dispatch => ({
  onChangeRoute: route => dispatch(changeRoute(route)),
  onOpenDialogAbout: () => dispatch(openDialogAbout()),
  onOpenDialogAccount: () => dispatch(openDialogAccount()),
  onOpenDialogFeedback: () => dispatch(openDialogFeedback()),
  onOpenDialogSubmitApp: () => dispatch(openDialogSubmitApp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(EnhancedAppBar));
