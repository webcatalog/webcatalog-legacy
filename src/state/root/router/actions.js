import {
  ROUTE_TOP_CHARTS,
} from '../../../constants/routes';
import {
  routeChange,
} from './action-creators';

export const changeRoute = newRoute =>
  (dispatch, getState) => {
    const router = getState().router;
    const { route } = router;

    if (newRoute === route) return;

    dispatch(routeChange(newRoute, route));
  };

export const goBack = () =>
  (dispatch, getState) => {
    const router = getState().router;
    const { route, previousRoute } = router;

    dispatch(routeChange(previousRoute || ROUTE_TOP_CHARTS, route));
  };
