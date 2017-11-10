import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui-icons/Refresh';

import connectComponent from '../../helpers/connect-component';

import {
  resetAndGetApps as refreshTopCharts,
} from '../../actions/pages/top-charts/actions';

import {
  ROUTE_TOP_CHARTS,
} from '../../constants/routes';

import {
  STRING_REFRESH,
} from '../../constants/strings';

const RefreshButton = (props) => {
  const {
    route,
    onRefreshTopCharts,
  } = props;

  let handleClick;
  switch (route) {
    case ROUTE_TOP_CHARTS:
      handleClick = onRefreshTopCharts;
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
  onRefreshTopCharts: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  route: state.router.route,
});

const actionCreators = {
  refreshTopCharts,
};

export default connectComponent(
  RefreshButton,
  mapStateToProps,
  actionCreators,
);
