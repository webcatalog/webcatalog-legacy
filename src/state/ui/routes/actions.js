import {
  routeChange,
} from './action-creators';

export const changeRoute = route =>
  dispatch => dispatch(routeChange(route));
