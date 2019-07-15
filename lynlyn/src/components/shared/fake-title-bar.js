import React from 'react';
import PropTypes from 'prop-types';

import teal from '@material-ui/core/colors/teal';

import connectComponent from '../../helpers/connect-component';

const titleBarHeight = 22;

const styles = {
  root: {
    background: teal[700],
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
  background: teal[700],
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
