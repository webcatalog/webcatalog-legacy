import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import connectComponent from '../helpers/connect-component';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    bottom: 0,
    color: theme.palette.text.primary,
    height: 20,
    left: 0,
    lineHeight: '20px',
    padding: '0 8px',
    position: 'fixed',
    zIndex: 100,
  },
  rootWithLeftNav: {
    left: 68,
  },
});

const TargetUrlBar = (props) => {
  const {
    classes,
    navigationBarPosition,
    targetUrl,
  } = props;

  if (!targetUrl) {
    return null;
  }

  return (
    <div
      className={classnames(
        classes.root,
        { [classes.rootWithLeftNav]: navigationBarPosition === 'left' },
      )}
    >
      {targetUrl}
    </div>
  );
};

TargetUrlBar.defaultProps = {
  targetUrl: null,
};

TargetUrlBar.propTypes = {
  classes: PropTypes.object.isRequired,
  navigationBarPosition: PropTypes.string.isRequired,
  targetUrl: PropTypes.string,
};

const mapStateToProps = state => ({
  navigationBarPosition: state.preferences.navigationBarPosition,
  targetUrl: state.nav.targetUrl,
});

export default connectComponent(
  TargetUrlBar,
  mapStateToProps,
  null,
  styles,
);
