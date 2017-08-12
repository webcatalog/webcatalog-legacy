import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import blue from 'material-ui/colors/blue';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const titleBarHeight = window.platform === 'darwin' ? 22 : 0;

const styleSheet = createStyleSheet('FakeTitleBar', {
  root: {
    backgroundColor: blue[700],
    height: titleBarHeight,
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
});

const FakeTitleBar = (props) => {
  const {
    classes,
    color,
  } = props;

  return (
    <div
      className={classes.root}
      style={{ backgroundColor: color }}
    />
  );
};

FakeTitleBar.defaultProps = {
  color: blue[700],
};

FakeTitleBar.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(FakeTitleBar));
