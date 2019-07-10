import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AppBar from 'material-ui/AppBar';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import CloseIcon from 'material-ui-icons/Close';
import common from 'material-ui/colors/common';
import grey from 'material-ui/colors/grey';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import SearchIcon from 'material-ui-icons/Search';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import connectComponent from '../../helpers/connect-component';

import RefreshButton from './refresh-button';

import { formUpdate } from '../../state/pages/search/actions';
import {
  goBack,
  changeRoute,
} from '../../state/root/router/actions';

import {
  ROUTE_SEARCH,
} from '../../constants/routes';

import {
  STRING_BACK,
  STRING_CLEAR,
  STRING_SEARCH_APPS,
  STRING_TOP_CHARTS,
} from '../../constants/strings';

import { requestCheckForUpdates } from '../../senders/updater';

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
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
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
    background: theme.palette.primary[700],
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
    backgroundColor: theme.palette.primary[400],
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
    requestCheckForUpdates();
  }

  handleToggleDrawer() {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
  }

  render() {
    const {
      classes,
      onChangeRoute,
      onFormUpdate,
      onGoBack,
      query,
      route,
    } = this.props;

    let routeLabel;
    switch (route) {
      default:
        routeLabel = STRING_TOP_CHARTS;
    }

    const isSearching = route === ROUTE_SEARCH;

    const drawerElement = null;
    const titleElement = !isSearching
      ? (
        <div className={classes.toolbarSection}>
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

    const searchAction = !isSearching
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
        {drawerElement}
        <AppBar position="static" key="appBar" className={classes.appBar} elevation={3}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.toolbarSectionContainer}>
              {titleElement}
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
  query: '',
};

EnhancedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  query: PropTypes.string,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  query: state.pages.search.form.query,
  route: state.router.route,
});

const actionCreators = {
  changeRoute,
  formUpdate,
  goBack,
};

export default connectComponent(
  EnhancedAppBar,
  mapStateToProps,
  actionCreators,
  styles,
);
