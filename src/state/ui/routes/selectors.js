import { APPS } from './constants';

export const isViewingAllApps = state =>
  state.ui.routes.apps === APPS.ALL;

export const isViewingMyApps = state =>
  state.ui.routes.apps === APPS.MY_APPS;
