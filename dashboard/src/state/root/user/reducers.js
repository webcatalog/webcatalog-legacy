import { combineReducers } from 'redux';

import {
  USER_GET_REQUEST,
  USER_GET_SUCCESS,
  USER_GET_FAILED,
} from '../../../constants/actions';

const apiData = (state = false, action) => {
  switch (action.type) {
    case USER_GET_SUCCESS: return action.res;
    default: return state;
  }
};

const isGetting = (state = false, action) => {
  switch (action.type) {
    case USER_GET_REQUEST: return true;
    case USER_GET_SUCCESS: return false;
    case USER_GET_FAILED: return false;
    default: return state;
  }
};

export default combineReducers({
  apiData,
  isGetting,
});
