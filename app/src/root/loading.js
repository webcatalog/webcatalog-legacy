import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { CircularProgress } from 'material-ui/Progress';

import connectComponent from '../helpers/connect-component';

const styles = {
  root: {
    alignItems: 'center',
    bottom: 0,
    height: 36,
    justifyContent: 'center',
    position: 'fixed',
    width: 36,
    zIndex: 100,
  },
  rootLeftAligned: {
    left: 12,
  },
  rootRightAligned: {
    right: 0,
  },
};

const Loading = (props) => {
  const {
    classes,
    navigationBarPosition,
    showNavigationBar,
  } = props;

  const leftAligned = showNavigationBar && navigationBarPosition === 'right';

  return (
    <div
      className={classnames(
        classes.root,
        leftAligned && classes.rootLeftAligned,
        !leftAligned && classes.rootRightAligned,
      )}
    >
      <CircularProgress size={24} />
    </div>
  );
};

Loading.defaultProps = {
  navigationBarPosition: 'left',
  showNavigationBar: true,
};

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
  navigationBarPosition: PropTypes.string,
  showNavigationBar: PropTypes.bool,
};

const mapStateToProps = state => ({
  navigationBarPosition: state.preferences.navigationBarPosition,
  showNavigationBar: state.preferences.showNavigationBar,
});

export default connectComponent(
  Loading,
  mapStateToProps,
  null,
  styles,
);
