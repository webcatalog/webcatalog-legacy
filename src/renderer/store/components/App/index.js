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

import MoreMenuButton from './MoreMenuButton';
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
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.fakeTitleBar} />
      <AppBar position="static">
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.title}>Explore</Typography>
          <IconButton color="contrast" aria-label="Search">
            <SearchIcon />
          </IconButton>
          <MoreMenuButton />
        </Toolbar>
      </AppBar>

      <Home />
    </div>
  );
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(App));
