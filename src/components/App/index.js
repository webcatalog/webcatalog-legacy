import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Slide from 'material-ui/transitions/Slide';
import Fade from 'material-ui/transitions/Fade';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import SearchIcon from 'material-ui-icons/Search';
import CloseIcon from 'material-ui-icons/Close';
import MenuIcon from 'material-ui-icons/Menu';
import { CircularProgress } from 'material-ui/Progress';
import Drawer from 'material-ui/Drawer';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { grey } from 'material-ui/styles/colors';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Auth from '../Auth';
import FilterMenuButton from './FilterMenuButton';
import getSingularLabel from '../../utils/categories';
import Home from '../Home';
import FakeTitleBar from '../shared/FakeTitleBar';
import MoreMenuButton from './MoreMenuButton';
import SortMenuButton from './SortMenuButton';
import EnhancedSnackBar from './EnhancedSnackbar';
import RefreshButton from './RefreshButton';

const title = {
  padding: '0 16px',
  flex: 1,
  userSelect: 'none',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};
const styleSheet = createStyleSheet('App', {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
  },

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
  },
  searchBar: {
    boxShadow: 'none',
    position: 'absolute',
    zIndex: 2,
  },
  searchAppBarOpen: {
    // boxShadow: 'none',
    paddingTop: 24,
  },
  searchAppBar: {
    boxShadow: 'none',
    paddingTop: 24,
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

  render() {
    const {
      category,
      classes,
      isGettingApps,
      isLoggedIn,
      sortBy,
      sortOrder,
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

    return (
      <div className={classes.root}>
        {isLoggedIn ? [
          <FakeTitleBar />,
          <Drawer
            open={this.state.isDrawerOpen}
            onRequestClose={this.handleToggleDrawer}
            onClick={this.handleToggleDrawer}
          >
            test
          </Drawer>,
          <Slide in={isSearchBarOpen} className={classes.searchBar}>
            <div
              className={classes.appBarContainer}
              ref={(appBar) => { this.appBar = appBar; }}
            >
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
                      autofocus
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
          </Slide>,
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
              <MoreMenuButton />
            </Toolbar>
          </AppBar>,
          <Fade in={isGettingApps}>
            <div className={classes.circularProgressContainer}>
              <Paper className={classes.circularProgressPaper} elevation={10}>
                <CircularProgress size={32} />
              </Paper>
            </div>
          </Fade>,
          <Home key="routes" />,
        ] : <Auth />}
        <EnhancedSnackBar />
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
  isGettingApps: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  category: state.home.category,
  isLoggedIn: 1,
  // isLoggedIn: Boolean(true || state.auth.token),
  sortBy: state.home.sortBy,
  sortOrder: state.home.sortOrder,
  isGettingApps: state.home.isGettingApps,
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(App));
