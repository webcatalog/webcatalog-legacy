import { combineReducers } from 'redux';

import {
  SET_HOME_STATUS,
  ADD_HOME_APPS,
  APPS_RESET,
  APPS_SET_CATEGORY,
  APPS_SET_SORT_BY,
  APPS_SET_SORT_ORDER,
  APPS_GET_REQUEST,
  APPS_GET_SUCCESS,
} from '../../constants/actions';

const isGetting = (state = false, action) => {
  switch (action.type) {
    case APPS_GET_REQUEST: return true;
    case APPS_GET_SUCCESS: return false;
    default: return state;
  }
};

const queryParamsInitialState = {
  category: null,
  sortBy: 'installCount',
  sortOrder: 'desc',
};
const queryParams = (state = queryParamsInitialState, action) => {
  switch (action.type) {
    case APPS_SET_CATEGORY: {
      const { category } = action;
      return Object.assign({}, state, { category });
    }
    case APPS_SET_SORT_BY: {
      const { sortBy } = action;
      return Object.assign({}, state, { sortBy });
    }
    case APPS_SET_SORT_ORDER: {
      const { sortOrder } = action;
      return Object.assign({}, state, { sortOrder });
    }
    default:
      return state;
  }
};

const apiDataInitialState = {
  apps: [],
};
const apiData = (state = apiDataInitialState, action) => {
  switch (action.type) {
    case SET_HOME_STATUS: {
      const { status } = action;
      return Object.assign({}, state, {
        status,
      });
    }
    case ADD_HOME_APPS: {
      const { chunk, currentPage, totalPage } = action;

      return Object.assign({}, state, {
        apps: state.apps.concat(chunk),
        currentPage,
        totalPage,
      });
    }
    case APPS_RESET: {
      // Keep category and sort option
      const { category, sortBy, sortOrder } = state;

      return Object.assign({}, apiDataInitialState, {
        category, sortBy, sortOrder,
      });
    }
    default: return state;
  }
};

export default combineReducers({
  apiData,
  queryParams,
  isGetting,
});
