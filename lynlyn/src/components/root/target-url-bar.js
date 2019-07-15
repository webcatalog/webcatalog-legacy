import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../../helpers/connect-component';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    bottom: 0,
    color: theme.palette.text.primary,
    height: 20,
    right: 0,
    lineHeight: '20px',
    padding: '0 8px',
    position: 'fixed',
    zIndex: 100,
    fontSize: '13px',
  },
});

const TargetUrlBar = (props) => {
  const {
    classes,
    url,
  } = props;

  if (!url) {
    return null;
  }

  return (
    <div className={classes.root}>
      {url}
    </div>
  );
};

TargetUrlBar.defaultProps = {
  url: null,
};

TargetUrlBar.propTypes = {
  classes: PropTypes.object.isRequired,
  url: PropTypes.string,
};

export default connectComponent(
  TargetUrlBar,
  null,
  null,
  styles,
);
