import { combineReducers } from 'redux';

import { ROUTE_HOME } from '../../constants/routes';

import { CHANGE_ROUTE } from '../../constants/actions';

const route = (state = ROUTE_HOME, action) => {
  switch (action.type) {
    case CHANGE_ROUTE: return action.route;
    default: return state;
  }
};

export default combineReducers({
  route,
});
