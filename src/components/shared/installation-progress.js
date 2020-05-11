import PropTypes from 'prop-types';
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

import connectComponent from '../../helpers/connect-component';

const styles = (theme) => ({
  root: {
    position: 'relative',
  },
  top: {
    color: theme.palette.primary.main,
    position: 'absolute',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: 2,
  },
  bottom: {
    color: theme.palette.primary.main,
    opacity: 0.2,
    // animationDuration: '550ms',
    position: 'absolute',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: 1,
  },
});

const AppCard = ({
  classes,
  defaultDesc,
  progressDesc,
  progressPercent,
}) => (
  <div className={classes.root}>
    <Tooltip title={progressDesc || defaultDesc} aria-label={progressDesc || defaultDesc} placement="right">
      <CircularProgress
        variant="static"
        value={progressPercent}
        className={classes.top}
        size={32}
        thickness={4}
      />
    </Tooltip>
    <CircularProgress
      variant="static"
      value={100}
      disableShrink
      className={classes.bottom}
      size={32}
      thickness={4}
    />
  </div>
);

AppCard.defaultProps = {
  progressDesc: null,
  progressPercent: 0,
};

AppCard.propTypes = {
  classes: PropTypes.object.isRequired,
  progressDesc: PropTypes.string,
  progressPercent: PropTypes.number,
  defaultDesc: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  progressPercent: state.general.installationProgress.percent,
  progressDesc: state.general.installationProgress.desc,
});

export default connectComponent(
  AppCard,
  mapStateToProps,
  null,
  styles,
);
