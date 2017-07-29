import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import grey from 'material-ui/colors/grey';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import AppBar from './AppBar';
import Login from './Login';
import Apps from './Apps';
import EnhancedSnackBar from './Shared/EnhancedSnackbar';

const title = {
  lineHeight: 1.5,
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
  list: {
    width: 304,
    flex: 'initial',
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
  headerContainer: {
    // backgroundColor: grey[200],
  },
});

const App = (props) => {
  const {
    isLoggedIn,
  } = props;

  const element = isLoggedIn
    ? (
      <div>
        <AppBar />
        <Apps key="routes" />
        <EnhancedSnackBar />
      </div>
    ) : <Login />;

  return element;
};

App.defaultProps = {
  category: null,
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  category: state.apps.queryParams.category,
  isLoggedIn: state.auth.token,
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(App));
