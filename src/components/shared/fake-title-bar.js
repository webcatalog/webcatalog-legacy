import React from 'react';
import PropTypes from 'prop-types';

import blue from '@material-ui/core/colors/blue';

import connectComponent from '../../helpers/connect-component';

const titleBarHeight = 22;

const styles = {
  root: {
    background: blue[700],
    height: titleBarHeight,
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
};

const FakeTitleBar = (props) => {
  const {
    classes,
    background,
  } = props;

  if (window.platform !== 'darwin') return null;

  return (
    <div
      className={classes.root}
      style={{ background }}
    />
  );
};

FakeTitleBar.defaultProps = {
  background: blue[700],
};

FakeTitleBar.propTypes = {
  classes: PropTypes.object.isRequired,
  background: PropTypes.string,
};

export default connectComponent(
  FakeTitleBar,
  null,
  null,
  styles,
);
