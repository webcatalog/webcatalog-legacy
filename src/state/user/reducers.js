import { combineReducers } from 'redux';

import {
  USER_GET_REQUEST,
  USER_GET_SUCCESS,
  USER_POST_REQUEST,
  USER_POST_SUCCESS,
  USER_PATCH_REQUEST,
  USER_PATCH_SUCCESS,
} from '../../constants/actions';

import apps from './apps/reducers';

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
    default: return state;
  }
};

const isPosting = (state = false, action) => {
  switch (action.type) {
    case USER_POST_REQUEST: return true;
    case USER_POST_SUCCESS: return false;
    default: return state;
  }
};

const isPatching = (state = false, action) => {
  switch (action.type) {
    case USER_PATCH_REQUEST: return true;
    case USER_PATCH_SUCCESS: return false;
    default: return state;
  }
};

export default combineReducers({
  apiData,
  isGetting,
  isPosting,
  isPatching,
  apps,
});
