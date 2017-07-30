import { combineReducers } from 'redux';

import { APPS } from './constants';

import {
  ROUTE_CHANGE,
} from '../../../constants/actions';

const apps = (state = APPS.ALL, action) => {
  switch (action.type) {
    case ROUTE_CHANGE: return action.route;
    default: return state;
  }
};

export default combineReducers({ apps });
