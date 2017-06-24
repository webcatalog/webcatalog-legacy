import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { blue } from 'material-ui/styles/colors';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Auth from '../Auth';
import FilterMenuButton from './FilterMenuButton';
import getSingularLabel from '../../utils/categories';
import Home from '../Home';
import MoreMenuButton from './MoreMenuButton';
import SortMenuButton from './SortMenuButton';

const titleBarHeight = process.env.PLATFORM === 'darwin' ? 21 : 0;

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

  title: {
    flex: 1,
    userSelect: 'none',
  },
});

const App = (props) => {
  const {
    category,
    classes,
    isLoggedIn,
    sortBy,
    sortOrder,
  } = props;

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
        <AppBar position="static" key="appBar">
          <Toolbar>
            {renderTitleElement()}
            <IconButton color="contrast" aria-label="Search">
              <SearchIcon />
            </IconButton>
            <SortMenuButton />
            <FilterMenuButton />
            <MoreMenuButton />
          </Toolbar>
        </AppBar>,
        <Home key="routes" />,
      ] : <Auth />}
    </div>
  );
};

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
  isLoggedIn: Boolean(state.auth.token),
  sortBy: state.home.sortBy,
  sortOrder: state.home.sortOrder,
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(App));
