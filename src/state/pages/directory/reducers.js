import { combineReducers } from 'redux';

import {
  DIRECTORY_GET_FAILED,
  DIRECTORY_GET_REQUEST,
  DIRECTORY_GET_SUCCESS,
  DIRECTORY_RESET,
  DIRECTORY_UPDATE_CURRENT_QUERY,
  DIRECTORY_UPDATE_QUERY,
} from '../../../constants/actions';

const hasFailed = (state = false, action) => {
  switch (action.type) {
    case DIRECTORY_GET_FAILED: return true;
    case DIRECTORY_GET_REQUEST: return false;
    case DIRECTORY_GET_SUCCESS: return false;
    default: return state;
  }
};

const hits = (state = [], action) => {
  switch (action.type) {
    case DIRECTORY_GET_SUCCESS: return state.concat(action.hits);
    case DIRECTORY_RESET: return [];
    default: return state;
  }
};

const isGetting = (state = false, action) => {
  switch (action.type) {
    case DIRECTORY_GET_FAILED: return false;
    case DIRECTORY_GET_REQUEST: return true;
    case DIRECTORY_GET_SUCCESS: return false;
    default: return state;
  }
};

const page = (state = -1, action) => {
  switch (action.type) {
    case DIRECTORY_GET_SUCCESS: return action.page;
    case DIRECTORY_RESET: return -1;
    default: return state;
  }
};

const currentQuery = (state = '', action) => {
  switch (action.type) {
    case DIRECTORY_UPDATE_CURRENT_QUERY: return action.currentQuery;
    default: return state;
  }
};

const query = (state = '', action) => {
  switch (action.type) {
    case DIRECTORY_UPDATE_QUERY: return action.query;
    default: return state;
  }
};

const totalPage = (state = 1, action) => {
  switch (action.type) {
    case DIRECTORY_GET_SUCCESS: return action.totalPage;
    case DIRECTORY_RESET: return 1;
    default: return state;
  }
};


export default combineReducers({
  currentQuery,
  hasFailed,
  hits,
  isGetting,
  page,
  query,
  totalPage,
});
