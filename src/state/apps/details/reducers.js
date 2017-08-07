import { combineReducers } from 'redux';

import {
  APPS_DETAILS_GET_REQUEST,
  APPS_DETAILS_GET_SUCCESS,
} from '../../../constants/actions';

const isGetting = (state = false, action) => {
  switch (action.type) {
    case APPS_DETAILS_GET_REQUEST: return true;
    case APPS_DETAILS_GET_SUCCESS: return false;
    default: return state;
  }
};

const apiDataInitialState = {};
const apiData = (state = apiDataInitialState, action) => {
  switch (action.type) {
    case APPS_DETAILS_GET_SUCCESS: return action.res.app;
    default: return state;
  }
};

export default combineReducers({
  apiData,
  isGetting,
});
