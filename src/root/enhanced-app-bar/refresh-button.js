import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui-icons/Refresh';

import connectComponent from '../../helpers/connect-component';

import {
  resetAndGetApps as refreshTopCharts,
} from '../../state/pages/top-charts/actions';
import {
  resetAndGetMyApps as refreshMyApps,
} from '../../state/pages/my-apps/actions';

import {
  ROUTE_MY_APPS,
  ROUTE_TOP_CHARTS,
} from '../../constants/routes';

import {
  STRING_REFRESH,
} from '../../constants/strings';

const RefreshButton = (props) => {
  const {
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
      aria-label={STRING_REFRESH}
      onClick={handleClick}
    >
      <RefreshIcon />
    </IconButton>
  );
};

RefreshButton.defaultProps = {
};

RefreshButton.propTypes = {
  onRefreshMyApps: PropTypes.func.isRequired,
  onRefreshTopCharts: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  route: state.router.route,
});

const actionCreators = {
  refreshMyApps,
  refreshTopCharts,
};

export default connectComponent(
  RefreshButton,
  mapStateToProps,
  actionCreators,
);
