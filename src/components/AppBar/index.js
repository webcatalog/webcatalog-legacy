/* global ipcRenderer */
import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PowerSettingsNewIcon from 'material-ui-icons/PowerSettingsNew';
import Slide from 'material-ui/transitions/Slide';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import AddBoxIcon from 'material-ui-icons/AddBox';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import AppsIcon from 'material-ui-icons/Apps';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import Divider from 'material-ui/Divider';
import HelpIcon from 'material-ui-icons/Help';
import Avatar from 'material-ui/Avatar';
import InfoIcon from 'material-ui-icons/Info';
import PublicIcon from 'material-ui-icons/Public';
import { MenuItem } from 'material-ui/Menu';
import List, { ListItemIcon, ListItemText } from 'material-ui/List';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import SearchIcon from 'material-ui-icons/Search';
import CloseIcon from 'material-ui-icons/Close';
import MenuIcon from 'material-ui-icons/Menu';
import Drawer from 'material-ui/Drawer';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import grey from 'material-ui/colors/grey';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import FilterMenuButton from './FilterMenuButton';
import getSingularLabel from '../../utils/getSingularLabel';
import FakeTitleBar from '../shared/FakeTitleBar';
import SortMenuButton from './SortMenuButton';
import RefreshButton from './RefreshButton';

import {
  isViewingAllApps as isViewingAllAppsSelector,
  isViewingMyApps as isViewingMyAppsSelector,
} from '../../state/ui/routes/selectors';

import { changeRoute } from '../../state/ui/routes/actions';
import { open as openDialogAccount } from '../../state/ui/dialogs/account/actions';
import { open as openDialogAbout } from '../../state/ui/dialogs/about/actions';
import { open as openDialogSubmitApp } from '../../state/ui/dialogs/submit-app/actions';
import {
  ROUTE_APPS,
  ROUTE_MY_APPS,
} from '../../constants/routes';

const title = {
  lineHeight: 1.5,
  padding: '0 16px',
  flex: 1,
  userSelect: 'none',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};
const styleSheet = createStyleSheet('App', {
  toolbar: {
    padding: '0 12px',
  },
  title,
  searchBarText: {
    ...title,
    fontWeight: 'normal',
    fontSize: 21,
  },
  appBar: {
    zIndex: 1,
  },
  appBarContainer: {
    width: '100%',
    // marginTop: -24,
  },
  searchBar: {
    boxShadow: 'none',
    position: 'absolute',
    zIndex: 2,
  },
  searchAppBarOpen: {
    marginTop: -44,
    // boxShadow: 'none',
    paddingTop: 22,
    // marginTop: -44,
  },
  searchAppBar: {
    marginTop: -44,
    boxShadow: 'none',
    paddingTop: 24,
  },
  indicator: {
    height: 3,
  },
  list: {
    width: 304,
    flex: 'initial',
  },
  input: {
    font: 'inherit',
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: 'inherit',
    width: '100%',
    '&:focus': {
      outline: 0,
    },
    '&::placeholder': {
      color: grey[400],
    },
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
  headerContainer: {
    // backgroundColor: grey[200],
  },
  menuItem: {
    '&:hover': {
      background: grey[300],
    },
  },
  menuItemSelected: {
    extend: 'menuItem',
    '&:hover': {
      background: grey[400],
    },
  },
});

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isDrawerOpen: false,
      isSearchBarOpen: false,
    };

    this.handleOutsideAppbarClick = this.handleOutsideAppbarClick.bind(this);
    this.handleToggleDrawer = this.handleToggleDrawer.bind(this);
    this.handleToggleSearchBar = this.handleToggleSearchBar.bind(this);
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

  handleToggleSearchBar() {
    const { isSearchBarOpen } = this.state;
    if (!isSearchBarOpen) {
      document.addEventListener('click', this.handleOutsideAppbarClick, false);
    } else document.removeEventListener('click', this.handleOutsideAppbarClick, false);

    this.setState({ isSearchBarOpen: !isSearchBarOpen });
  }

  handleOutsideAppbarClick(e) {
    if (!this.appBar.contains(e.target)) this.handleToggleSearchBar();
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
      category,
      classes,
      sortBy,
      sortOrder,
      onChangeRoute,
      isViewingAllApps,
      isViewingMyApps,
    } = this.props;

    const { isSearchBarOpen } = this.state;

    const renderTitleElement = () => {
      const appString = category ? `${getSingularLabel(category)} apps` : 'apps';

      let titleText;
      switch (sortBy) {
        case 'installCount': {
          titleText = sortOrder === 'asc' ? `Least popular ${appString}` : `Most popular ${appString}`;
          break;
        }
        case 'name': {
          titleText = sortOrder === 'asc' ? `${appString} by name (A-Z)` : `${appString} by name (Z-A)`;
          break;
        }
        case 'createdAt': {
          titleText = `Most recently added ${appString}`;
          break;
        }
        default: break;
      }
      titleText = titleText.charAt(0).toUpperCase() + titleText.slice(1);

      return (
        <Typography
          className={classes.title}
          color="inherit"
          type="title"
        >
          {titleText}
        </Typography>
      );
    };

    const temp = (
      <div className={classes.headerContainer}>
        <Avatar className={classes.avatar}>Q</Avatar>
        <div className={classes.nameDetails}>
          <div className={classes.nameDetailsName}>
            Quang Lam
          </div>
          <div className={classes.nameDetailsEmail}>
            quang@getwebcatalog.com
          </div>
        </div>
      </div>
    );

    return (
      <div>
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
                selected={isViewingAllApps}
                button
                onClick={() => onChangeRoute(ROUTE_APPS)}
                className={isViewingAllApps ? classes.menuItemSelected : classes.menuItem}
              >
                <ListItemIcon><AppsIcon /></ListItemIcon>
                <ListItemText primary="Apps" />
              </MenuItem>
              <MenuItem
                selected={isViewingMyApps}
                button
                onClick={() => onChangeRoute(ROUTE_MY_APPS)}
                className={isViewingMyApps ? classes.menuItemSelected : classes.menuItem}
              >
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="My apps" />
              </MenuItem>
              <Divider />
              <MenuItem button onClick={this.handleOpenDialogAccount}>
                <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                <ListItemText primary="Account" />
              </MenuItem>
              <MenuItem button onClick={this.handleOpenDialogSubmitApp}>
                <ListItemIcon><AddBoxIcon /></ListItemIcon>
                <ListItemText primary="Submit app" />
              </MenuItem>
              <MenuItem button onClick={() => ipcRenderer.send('log-out')}>
                <ListItemIcon><PowerSettingsNewIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
              <Divider />
              <MenuItem button onClick={this.handleRequestClose}>
                <ListItemIcon><HelpIcon /></ListItemIcon>
                <ListItemText primary="Help" />
              </MenuItem>
              <MenuItem button onClick={this.handleRequestClose}>
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
        <Slide in={isSearchBarOpen} className={classes.searchBar}>
          <div
            className={classes.appBarContainer}
            ref={(appBar) => { this.appBar = appBar; }}
          >
            <FakeTitleBar isColorDisabled />
            <AppBar
              color="default"
              position="static"
              key="searchBar"
              className={isSearchBarOpen ? classes.searchAppBarOpen : classes.searchAppBar}
            >
              <Toolbar className={classes.toolbar}>
                <IconButton
                  color={grey[100]}
                  aria-label="Menu"
                  onClick={() => this.handleToggleSearchBar()}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography
                  className={classes.searchBarText}
                  color="inherit"
                  type="title"
                >
                  <input
                    placeholder="Search apps"
                    className={classes.input}
                  />
                </Typography>
                <IconButton
                  color={grey[100]}
                  aria-label="Close"
                  onClick={() => this.handleToggleSearchBar()}
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
          </div>
        </Slide>
        <AppBar position="static" key="appBar" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              color="contrast"
              aria-label="Menu"
              onClick={() => this.handleToggleDrawer()}
            >
              <MenuIcon />
            </IconButton>
            {renderTitleElement()}
            <IconButton
              color="contrast"
              aria-label="Search"
              onClick={() => this.handleToggleSearchBar()}
            >
              <SearchIcon />
            </IconButton>
            <SortMenuButton />
            <FilterMenuButton />
            <RefreshButton />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

App.defaultProps = {
  category: null,
};

App.propTypes = {
  category: PropTypes.string,
  classes: PropTypes.object.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogSubmitApp: PropTypes.func.isRequired,
  onOpenDialogAccount: PropTypes.func.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  isViewingAllApps: PropTypes.bool.isRequired,
  isViewingMyApps: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  category: state.apps.queryParams.category,
  isLoggedIn: Boolean(state.auth.token),
  sortBy: state.apps.queryParams.sortBy,
  isViewingAllApps: isViewingAllAppsSelector(state),
  isViewingMyApps: isViewingMyAppsSelector(state),
  sortOrder: state.apps.queryParams.sortOrder,
});

const mapDispatchToProps = dispatch => ({
  onOpenDialogAbout: () => dispatch(openDialogAbout()),
  onOpenDialogSubmitApp: () => dispatch(openDialogSubmitApp()),
  onOpenDialogAccount: () => dispatch(openDialogAccount()),
  onChangeRoute: route => dispatch(changeRoute(route)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(App));
