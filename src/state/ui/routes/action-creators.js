import {
  ROUTE_CHANGE,
} from '../../../constants/actions';

export const routeChange = route => ({
  type: ROUTE_CHANGE,
  route,
});
