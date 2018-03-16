import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../../helpers/connect-component';

const titleBarHeight = window.platform === 'darwin' ? 22 : 0;

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
    height: titleBarHeight,
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
});

const FakeTitleBar = (props) => {
  const {
    classes,
  } = props;

  return (
    <div className={classes.root} />
  );
};

FakeTitleBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  FakeTitleBar,
  null,
  null,
  styles,
);
