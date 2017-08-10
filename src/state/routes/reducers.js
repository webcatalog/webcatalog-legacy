import { combineReducers } from 'redux';

import {
  ROUTE_APPS,
} from '../../constants/routes';

import {
  ROUTE_CHANGE,
} from '../../constants/actions';

const apps = (state = ROUTE_APPS, action) => {
  switch (action.type) {
    case ROUTE_CHANGE: return action.route;
    default: return state;
  }
};

export default combineReducers({ apps });
