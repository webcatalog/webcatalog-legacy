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

const styleSheet = createStyleSheet('App', theme => ({
  root: {
    width: '100vw',
    overflow: 'hidden',
  },

  fakeTitleBar: {
    backgroundColor: blue[700],
    width: '100vw',
    height: titleBarHeight,
    position: 'fixed',
    top: 0,
    left: 'auto',
    right: 0,
    zIndex: 1100,
    WebkitUserSelect: 'none',
    WebkitAppRegion: 'drag',
  },

  appBar: {
    top: titleBarHeight,
  },

  title: {
    flex: 1,
    userSelect: 'none',
  },

  content: {
    marginTop: theme.spacing.unit * 8,
    marginBottom: theme.spacing.unit * 4,
  },
}));

const App = (props) => {
  const {
    classes,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.fakeTitleBar} />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.title}>Explore</Typography>
          <IconButton color="contrast" aria-label="Search">
            <SearchIcon />
          </IconButton>
          <MoreMenuButton />
        </Toolbar>
      </AppBar>

      <div className={classes.content}>
        <Home />
      </div>
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
