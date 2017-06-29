/* global shellInfo */
import React from 'react';
import PropTypes from 'prop-types';

import { grey } from 'material-ui/styles/colors';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Tabs from './Tabs';
import WebView from './WebView';
import WebNav from './WebNav';

const styleSheet = createStyleSheet('App', theme => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
  },
  leftNav: {
    backgroundColor: theme.palette.background.default,
    flexBasis: 88,
    width: 88,
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    WebkitUserSelect: 'none',
    WebkitAppRegion: 'drag',
  },
  leftNavBlank: {
    height: window.PLATFORM === 'darwin' ? theme.spacing.unit * 4 : theme.spacing.unit,
  },
  webNavContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    padding: theme.spacing.unit,
    boxSizing: 'border-box',
    borderTop: `1px solid ${grey[500]}`,
  },
  webNavIconButtonRoot: {
    height: 28,
    width: 28,
  },
  webNavIconButtonIcon: {
    height: 20,
    width: 20,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    height: '100%',
    width: '100%',
  },
}));

const App = (props) => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <div className={classes.leftNav}>
        <div className={classes.leftNavBlank} />
        <Tabs />
        <WebNav />
      </div>
      <WebView
        parentClassName={classes.webviewContainer}
        className={classes.webview}
        plugins
        allowpopups
        autoresize
        src={shellInfo.url}
      />
    </div>
  );
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(App);
