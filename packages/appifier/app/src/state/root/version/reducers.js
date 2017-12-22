import { combineReducers } from 'redux';

import {
  VERSION_GET_REQUEST,
  VERSION_GET_SUCCESS,
  VERSION_GET_FAILED,
} from '../../../constants/actions';

const defaultApiData = {
  moleculeVersion: '1.0.0',
  version: '1.0.0',
};

const apiData = (state = defaultApiData, action) => {
  switch (action.type) {
    case VERSION_GET_SUCCESS: return action.res;
    default: return state;
  }
};

const isGetting = (state = false, action) => {
  switch (action.type) {
    case VERSION_GET_REQUEST: return true;
    case VERSION_GET_SUCCESS: return false;
    case VERSION_GET_FAILED: return false;
    default: return state;
  }
};

export default combineReducers({
  apiData,
  isGetting,
});
