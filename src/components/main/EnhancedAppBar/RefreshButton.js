import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui-icons/Refresh';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import {
  resetAndGetApps as refreshTopCharts,
} from '../../../state/pages/topCharts/actions';
import {
  resetAndGetMyApps as refreshMyApps,
} from '../../../state/pages/myApps/actions';

import {
  ROUTE_MY_APPS,
  ROUTE_TOP_CHARTS,
} from '../../../constants/routes';


const styleSheet = createStyleSheet('RefreshButton', {
  root: {
  },
});

const RefreshButton = (props) => {
  const {
    classes,
    route,
    onRefreshMyApps,
    onRefreshTopCharts,
  } = props;

  let handleClick;
  switch (route) {
    case ROUTE_TOP_CHARTS:
      handleClick = onRefreshTopCharts;
      break;
    case ROUTE_MY_APPS:
      handleClick = onRefreshMyApps;
      break;
    default:
      handleClick = null;
  }

  if (!handleClick) return null;

  return (
    <IconButton
      color="contrast"
      aria-label="Refresh"
      onClick={handleClick}
      className={classes.root}
    >
      <RefreshIcon />
    </IconButton>
  );
};

RefreshButton.defaultProps = {
};

RefreshButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onRefreshMyApps: PropTypes.func.isRequired,
  onRefreshTopCharts: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  route: state.router.route,
});

const mapDispatchToProps = dispatch => ({
  onRefreshMyApps: () => dispatch((refreshMyApps())),
  onRefreshTopCharts: () => dispatch((refreshTopCharts())),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(RefreshButton));
