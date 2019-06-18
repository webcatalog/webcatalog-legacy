import React from 'react';
import PropTypes from 'prop-types';

import blue from '@material-ui/core/colors/blue';

import connectComponent from '../../helpers/connect-component';

const titleBarHeight = window.process.platform === 'darwin' ? 22 : 0;

const styles = {
  root: {
    backgroundColor: blue[800],
    height: titleBarHeight,
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
};

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
  color: blue[800],
};

FakeTitleBar.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
};

export default connectComponent(
  FakeTitleBar,
  null,
  null,
  styles,
);
