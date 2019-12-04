import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../../helpers/connect-component';

const titleBarHeight = window.process.platform === 'darwin' ? 22 : 0;

const styles = (theme) => ({
  root: {
    background: theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[800],
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
  color: null,
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
