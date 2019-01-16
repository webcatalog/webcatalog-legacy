import { CHANGE_ROUTE } from '../../constants/actions';

export const changeRoute = route => ({
  type: CHANGE_ROUTE,
  route,
});
