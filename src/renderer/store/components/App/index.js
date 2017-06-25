import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import { blue } from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';

import Auth from '../Auth';
import MoreMenuButton from './MoreMenuButton';
import SortMenuButton from './SortMenuButton';
import Home from '../Home';

const titleBarHeight = process.env.PLATFORM === 'darwin' ? 21 : 0;

const styleSheet = createStyleSheet('App', {
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  fakeTitleBar: {
    backgroundColor: blue[700],
    width: '100vw',
    height: titleBarHeight,
    WebkitUserSelect: 'none',
    WebkitAppRegion: 'drag',
  },

  title: {
    flex: 1,
    userSelect: 'none',
  },
});

const App = (props) => {
  const {
    classes,
    isLoggedIn,
    sortBy,
    sortOrder,
  } = props;

  const renderTitleElement = () => {
    let titleText;
    switch (sortBy) {
      case 'installCount': {
        titleText = sortOrder === 'asc' ? 'Least popular apps' : 'Most popular apps';
        break;
      }
      case 'name': {
        titleText = sortOrder === 'asc' ? 'Apps by name (A-Z)' : 'Apps by name (Z-A)';
        break;
      }
      case 'createdAt': {
        titleText = 'Most recently added apps';
        break;
      }
      default: break;
    }

    return (
      <Typography
        type="title"
        color="inherit"
        className={classes.title}
      >
        {titleText}
      </Typography>
    );
  };

  return (
    <div className={classes.root}>
      {isLoggedIn ? [
        <div className={classes.fakeTitleBar} key="fakeTitleBar" />,
        <AppBar position="static" key="appBar">
          <Toolbar>
            {renderTitleElement()}
            <IconButton color="contrast" aria-label="Search">
              <SearchIcon />
            </IconButton>
            <SortMenuButton />
            <MoreMenuButton />
          </Toolbar>
        </AppBar>,
        <Home key="routes" />,
      ] : <Auth />}


    </div>
  );
};

App.defaultProps = {
  sortBy: null,
  sortOrder: null,
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.auth.token),
  sortBy: state.home.sortBy,
  sortOrder: state.home.sortOrder,
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(App));
