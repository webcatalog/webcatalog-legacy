import { combineReducers } from 'redux';

import {
  USER_APPS_GET_REQUEST,
  USER_APPS_GET_SUCCESS,
} from '../../constants/actions';

const apiDataInitialState = {
  apps: [],
  totalPage: 0,
};
const apiData = (state = apiDataInitialState, action) => {
  switch (action.type) {
    case USER_APPS_GET_SUCCESS: return action.res;
    default: return state;
  }
};

const isGetting = (state = false, action) => {
  switch (action.type) {
    case USER_APPS_GET_REQUEST: return true;
    case USER_APPS_GET_SUCCESS: return false;
    default: return state;
  }
};

export default combineReducers({
  apiData,
  isGetting,
});
