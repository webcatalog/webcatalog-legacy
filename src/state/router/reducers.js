import { combineReducers } from 'redux';

import { ROUTE_HOME, ROUTE_INSTALLED } from '../../constants/routes';

import { CHANGE_ROUTE } from '../../constants/actions';

import { getPreference } from '../../senders';

const defaultRoute = window.mode === 'menubar' || getPreference('defaultHome') === 'installed'
  ? ROUTE_INSTALLED : ROUTE_HOME;
const route = (state = defaultRoute, action) => {
  switch (action.type) {
    case CHANGE_ROUTE: return action.route;
    default: return state;
  }
};

export default combineReducers({
  route,
});
