import {
  ROUTE_APPS,
  ROUTE_MY_APPS,
} from '../../../constants/routes';

export const isViewingAllApps = state =>
  state.ui.routes.apps === ROUTE_APPS;

export const isViewingMyApps = state =>
  state.ui.routes.apps === ROUTE_MY_APPS;
