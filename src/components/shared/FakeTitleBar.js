import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { blue } from 'material-ui/styles/colors';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const titleBarHeight = window.platform === 'darwin' ? 22 : 0;

const styleSheet = createStyleSheet('FakeTitleBar', {
  root: {
    backgroundColor: blue[700],
    height: titleBarHeight,
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
    width: '100vw',
  },
});

const FakeTitleBar = (props) => {
  const { classes } = props;

  return (
    <div className={classes.root} key="fakeTitleBar" />
  );
};

FakeTitleBar.defaultProps = {
};

FakeTitleBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(FakeTitleBar));
