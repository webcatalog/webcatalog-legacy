import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Slide from 'material-ui/transitions/Slide';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import SearchIcon from 'material-ui-icons/Search';
import CloseIcon from 'material-ui-icons/Close';
import MenuIcon from 'material-ui-icons/Menu';
import RefreshIcon from 'material-ui-icons/Refresh';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { blue, grey } from 'material-ui/styles/colors';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Auth from '../Auth';
import FilterMenuButton from './FilterMenuButton';
import getSingularLabel from '../../utils/categories';
import Home from '../Home';
import MoreMenuButton from './MoreMenuButton';
import SortMenuButton from './SortMenuButton';

const titleBarHeight = window.platform === 'darwin' ? 22 : 0;

const title = {
  padding: '0 16px',
  flex: 1,
  userSelect: 'none',
};
const styleSheet = createStyleSheet('App', {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
  },

  fakeTitleBar: {
    backgroundColor: blue[700],
    height: titleBarHeight,
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
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
  searchBar: {
    boxShadow: 'none',
    position: 'absolute',
    zIndex: 2,
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
});

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isSearchBarOpen: false,
    };

    this.handleToggleSearchBar = this.handleToggleSearchBar.bind(this);
  }

  handleToggleSearchBar() {
    this.setState({ isSearchBarOpen: !this.state.isSearchBarOpen });
  }

  render() {
    const {
      category,
      classes,
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
          <div className={classes.fakeTitleBar} key="fakeTitleBar" />,
          <Slide in={isSearchBarOpen} className={classes.searchBar}>
            <AppBar color="default" position="static" key="searchBar">
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
          </Slide>,
          <AppBar position="static" key="appBar" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <IconButton color="contrast" aria-label="Menu">
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
              <IconButton color="contrast" aria-label="Refresh">
                <RefreshIcon />
              </IconButton>
              <MoreMenuButton />
            </Toolbar>
          </AppBar>,
          <Home key="routes" />,
        ] : <Auth />}
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
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(App));
