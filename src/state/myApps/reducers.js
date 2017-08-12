import { combineReducers } from 'redux';

import {
  MY_APPS_GET_FAILED,
  MY_APPS_GET_REQUEST,
  MY_APPS_GET_SUCCESS,
} from '../../constants/actions';

const hasFailed = (state = false, action) => {
  switch (action.type) {
    case MY_APPS_GET_REQUEST: return false;
    case MY_APPS_GET_SUCCESS: return false;
    case MY_APPS_GET_FAILED: return true;
    default: return state;
  }
};

const apiDataInitialState = {
  apps: [],
  totalPage: 0,
};
const apiData = (state = apiDataInitialState, action) => {
  switch (action.type) {
    case MY_APPS_GET_SUCCESS: return {
      apps: state.apps.concat(action.res.apps),
      totalPage: action.res.totalPage,
    };
    default: return state;
  }
};

const queryParamsInitialState = {
  page: 0,
};
const queryParams = (state = queryParamsInitialState, action) => {
  switch (action.type) {
    case MY_APPS_GET_SUCCESS: {
      return {
        ...state,
        page: state.page + 1,
      };
    }
    default:
      return state;
  }
};

const isGetting = (state = false, action) => {
  switch (action.type) {
    case MY_APPS_GET_REQUEST: return true;
    case MY_APPS_GET_SUCCESS: return false;
    default: return state;
  }
};

export default combineReducers({
  apiData,
  hasFailed,
  isGetting,
  queryParams,
});
