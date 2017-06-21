import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import MoreVertIcon from 'material-ui-icons/MoreVert';

import Home from './Home';

const styleSheet = createStyleSheet('App', theme => ({
  root: {
    width: '100vw',
    overflow: 'hidden',
  },

  title: {
    flex: 1,
    userSelect: 'none',
  },

  content: {
    marginTop: theme.spacing.unit * 8,
    marginBottom: theme.spacing.unit * 4,
  },

  paperGrid: {
    width: '100%',
    paddingTop: theme.spacing.unit * 4,
  },

  paper: {
    width: 200,
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    boxSizing: 'border-box',
  },

  paperIcon: {
    width: 80,
    height: 80,
  },

  titleText: {
    fontWeight: 500,
    lineHeight: 1,
    marginTop: theme.spacing.unit,
  },

  domainText: {
    fontWeight: 400,
    lineHeight: 1,
    marginBottom: theme.spacing.unit,
  },

  rightButton: {
    marginLeft: theme.spacing.unit,
  },
}));

const App = (props) => {
  const {
    classes,
  } = props;

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.title}>Explore</Typography>
          <IconButton color="contrast" aria-label="Search">
            <SearchIcon />
          </IconButton>
          <IconButton color="contrast" aria-label="More">
            <MoreVertIcon />
          </IconButton>
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
