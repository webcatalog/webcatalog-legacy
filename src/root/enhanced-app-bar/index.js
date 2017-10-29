import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MenuItem } from 'material-ui/Menu';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import AddBoxIcon from 'material-ui-icons/AddBox';
import AppBar from 'material-ui/AppBar';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import Avatar from 'material-ui/Avatar';
import blue from 'material-ui/colors/blue';
import CloseIcon from 'material-ui-icons/Close';
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
import LocalOfferIcon from 'material-ui-icons/LocalOffer';
import MenuIcon from 'material-ui-icons/Menu';
import Paper from 'material-ui/Paper';
import PowerSettingsNewIcon from 'material-ui-icons/PowerSettingsNew';
import SearchIcon from 'material-ui-icons/Search';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import connectComponent from '../../helpers/connect-component';

import FakeTitleBar from '../../shared/fake-title-bar';
import RefreshButton from './refresh-button';

import { formUpdate } from '../../state/pages/search/actions';
import { open as openDialogAbout } from '../../state/dialogs/about/actions';
import { open as openDialogSubmitApp } from '../../state/dialogs/submit-app/actions';
import {
  goBack,
  changeRoute,
} from '../../state/root/router/actions';

import {
  ROUTE_INSTALLED_APPS,
  ROUTE_MY_APPS,
  ROUTE_SEARCH,
  ROUTE_TOP_CHARTS,
} from '../../constants/routes';

import {
  STRING_ABOUT,
  STRING_ACCOUNT,
  STRING_BACK,
  STRING_CLEAR,
  STRING_HELP_AND_FEEDBACK,
  STRING_INSTALLED_APPS,
  STRING_LOG_IN,
  STRING_LOG_OUT,
  STRING_MENU,
  STRING_MY_APPS,
  STRING_SEARCH_APPS,
  STRING_SUBMIT_APP,
  STRING_TOP_CHARTS,
} from '../../constants/strings';

import { requestCheckForUpdates } from '../../senders/updater';
import { requestLogOut } from '../../senders/auth';
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
    this.handleOpenDialogAbout = this.handleOpenDialogAbout.bind(this);
    this.handleOpenDialogSubmitApp = this.handleOpenDialogSubmitApp.bind(this);
  }

  componentDidMount() {
    // start checking for installed apps only when the app is loaded.
    requestScanInstalledApps();
    requestCheckForUpdates();
  }

  handleToggleDrawer() {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
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
      isLoggedIn,
      onChangeRoute,
      onFormUpdate,
      onGoBack,
      profilePicture,
      query,
      route,
    } = this.props;

    let routeLabel;
    switch (route) {
      case ROUTE_INSTALLED_APPS:
        routeLabel = STRING_INSTALLED_APPS;
        break;
      case ROUTE_MY_APPS:
        routeLabel = STRING_MY_APPS;
        break;
      default:
        routeLabel = STRING_TOP_CHARTS;
    }

    const shouldShowSearch = route !== ROUTE_INSTALLED_APPS && route !== ROUTE_MY_APPS;

    const temp = isLoggedIn ? (
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
    ) : (
      <AppBar
        className={classes.signInAppBar}
        position="static"
        elevation={0}
        onClick={requestLogOut}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            color="inherit"
            type="title"
          >
            {STRING_LOG_IN}
          </Typography>
        </Toolbar>
      </AppBar>
    );

    const isSearching = route === ROUTE_SEARCH;

    const drawerElement = !isSearching
      ? (
        <Drawer
          open={this.state.isDrawerOpen}
          onRequestClose={this.handleToggleDrawer}
          onClick={this.handleToggleDrawer}
        >
          <FakeTitleBar color={isLoggedIn ? fullWhite : null} />
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
              <MenuItem
                selected={route === ROUTE_MY_APPS}
                button
                onClick={() => onChangeRoute(ROUTE_MY_APPS)}
                className={classes.menuItem}
              >
                <ListItemIcon><LocalOfferIcon /></ListItemIcon>
                <ListItemText primary={STRING_MY_APPS} />
              </MenuItem>
              <Divider />
              {isLoggedIn && (
                <MenuItem button onClick={() => requestOpenInBrowser('https://dashboard.webcatalog.io')}>
                  <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                  <ListItemText primary={STRING_ACCOUNT} />
                </MenuItem>
              )}
              <MenuItem button onClick={this.handleOpenDialogSubmitApp}>
                <ListItemIcon><AddBoxIcon /></ListItemIcon>
                <ListItemText primary={STRING_SUBMIT_APP} />
              </MenuItem>
              {isLoggedIn && (
                <MenuItem button onClick={requestLogOut}>
                  <ListItemIcon><PowerSettingsNewIcon /></ListItemIcon>
                  <ListItemText primary={STRING_LOG_OUT} />
                </MenuItem>
              )}
              <Divider />
              <MenuItem
                button
                onClick={() => requestOpenInBrowser('https://webcatalog.io/help')}
              >
                <ListItemIcon><HelpIcon /></ListItemIcon>
                <ListItemText primary={STRING_HELP_AND_FEEDBACK} />
              </MenuItem>
              <MenuItem button onClick={this.handleOpenDialogAbout}>
                <ListItemIcon><InfoIcon /></ListItemIcon>
                <ListItemText primary={STRING_ABOUT} />
              </MenuItem>
            </List>
          </div>
        </Drawer>
      ) : null;

    const titleElement = !isSearching
      ? (
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
      ) : (
        <div className={classes.toolbarSection}>
          <IconButton
            aria-label={STRING_BACK}
            color="contrast"
            onClick={() => {
              onFormUpdate({ query: '' });
              onGoBack();
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>
      );

    const refreshAction = !isSearching
      ? (
        <RefreshButton />
      ) : null;

    const searchAction = shouldShowSearch && !isSearching
      ? (
        <IconButton
          className={classes.searchButton}
          color={isSearching ? 'default' : 'contrast'}
          aria-label={query.length > 0 ? STRING_CLEAR : STRING_BACK}
          onClick={() => onChangeRoute(ROUTE_SEARCH)}
        >
          <SearchIcon />
        </IconButton>
      ) : null;

    const clearSearchAction = query.length > 0
      ? (
        <IconButton
          color={isSearching ? 'default' : 'contrast'}
          aria-label={query.length > 0 ? STRING_CLEAR : STRING_BACK}
          onClick={() => onFormUpdate({ query: '' })}
        >
          <CloseIcon />
        </IconButton>
      ) : null;

    return (
      <div className={classes.root}>
        <FakeTitleBar />
        {drawerElement}
        <AppBar position="static" key="appBar" className={classes.appBar} elevation={3}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.toolbarSectionContainer}>
              {titleElement}
              {shouldShowSearch && (
                <div className={classes.toolbarSearchContainer}>
                  <Paper
                    className={classNames(
                      classes.toolbarSectionSearch,
                      { [classes.toolbarSectionSearchInactive]: !isSearching },
                      { [classes.toolbarSectionSearchActive]: isSearching },
                    )}
                    elevation={isSearching ? 1 : 0}
                  >
                    <SearchIcon
                      className={classNames(
                        classes.searchIcon,
                        { [classes.searchIconActive]: isSearching },
                      )}
                    />
                    <Typography
                      className={classes.searchBarText}
                      color="inherit"
                      type="title"
                    >
                      <input
                        className={classNames(
                          classes.input,
                          { [classes.inputActive]: isSearching },
                        )}
                        onChange={e => onFormUpdate({ query: e.target.value })}
                        onClick={() => onChangeRoute(ROUTE_SEARCH)}
                        onInput={e => onFormUpdate({ query: e.target.value })}
                        placeholder={STRING_SEARCH_APPS}
                        ref={(inputBox) => { this.inputBox = inputBox; }}
                        value={query}
                      />
                    </Typography>
                    {clearSearchAction}
                  </Paper>
                </div>
              )}
              <div className={classes.toolbarSectionRight}>
                {refreshAction}
                {searchAction}
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

EnhancedAppBar.defaultProps = {
  displayName: null,
  email: null,
  profilePicture: null,
  query: '',
};

EnhancedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  displayName: PropTypes.string,
  email: PropTypes.string,
  isLoggedIn: PropTypes.bool.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogSubmitApp: PropTypes.func.isRequired,
  profilePicture: PropTypes.string,
  query: PropTypes.string,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  displayName: state.user.apiData.displayName,
  email: state.user.apiData.email,
  isLoggedIn: Boolean(state.auth.token && state.auth.token !== 'anonymous'),
  profilePicture: state.user.apiData.profilePicture,
  query: state.pages.search.form.query,
  route: state.router.route,
});

const actionCreators = {
  changeRoute,
  formUpdate,
  goBack,
  openDialogAbout,
  openDialogSubmitApp,
};

export default connectComponent(
  EnhancedAppBar,
  mapStateToProps,
  actionCreators,
  styles,
);
