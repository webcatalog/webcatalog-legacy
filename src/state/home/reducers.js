import { combineReducers } from 'redux';

import {
  HOME_GET_FAILED,
  HOME_GET_REQUEST,
  HOME_GET_SUCCESS,
  HOME_UPDATE_CURRENT_QUERY,
  HOME_UPDATE_QUERY,
  HOME_UPDATE_SCROLL_OFFSET,
} from '../../constants/actions';

const initiated = (state = false, action) => {
  switch (action.type) {
    case HOME_GET_SUCCESS: return true;
    default: return state;
  }
};

const hasFailed = (state = false, action) => {
  switch (action.type) {
    case HOME_GET_FAILED: return true;
    case HOME_GET_REQUEST: return false;
    case HOME_GET_SUCCESS: return false;
    case HOME_UPDATE_CURRENT_QUERY: return false;
    default: return state;
  }
};

const hits = (state = [], action) => {
  switch (action.type) {
    case HOME_GET_SUCCESS: return state.concat(action.hits);
    case HOME_UPDATE_CURRENT_QUERY: return [];
    default: return state;
  }
};

const isGetting = (state = false, action) => {
  switch (action.type) {
    case HOME_GET_FAILED: return false;
    case HOME_GET_REQUEST: return true;
    case HOME_GET_SUCCESS: return false;
    case HOME_UPDATE_CURRENT_QUERY: return false;
    default: return state;
  }
};

const page = (state = -1, action) => {
  switch (action.type) {
    case HOME_GET_SUCCESS: return action.page;
    case HOME_UPDATE_CURRENT_QUERY: return -1;
    default: return state;
  }
};

const currentQuery = (state = '', action) => {
  switch (action.type) {
    case HOME_UPDATE_CURRENT_QUERY: return action.currentQuery;
    default: return state;
  }
};

const query = (state = '', action) => {
  switch (action.type) {
    case HOME_UPDATE_QUERY: return action.query;
    default: return state;
  }
};

const totalPage = (state = 1, action) => {
  switch (action.type) {
    case HOME_GET_SUCCESS: return action.totalPage;
    case HOME_UPDATE_CURRENT_QUERY: return 1;
    default: return state;
  }
};

const scrollOffset = (state = 0, action) => {
  switch (action.type) {
    case HOME_UPDATE_SCROLL_OFFSET: return action.scrollOffset;
    case HOME_UPDATE_CURRENT_QUERY: return 0;
    default: return state;
  }
};

export default combineReducers({
  currentQuery,
  hasFailed,
  hits,
  initiated,
  isGetting,
  page,
  query,
  scrollOffset,
  totalPage,
});
