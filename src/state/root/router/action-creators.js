import { ROUTE_CHANGE } from '../../../constants/actions';

export const routeChange = (route, previousRoute) => ({
  type: ROUTE_CHANGE,
  route,
  previousRoute,
});
