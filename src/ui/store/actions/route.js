import { SET_ROUTE, GO_BACK } from '../constants/actions';

export const setRoute = routeId => ({
  type: SET_ROUTE,
  routeId,
});

export const goBack = () => ({
  type: GO_BACK,
});
