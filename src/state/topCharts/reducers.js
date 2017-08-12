import { combineReducers } from 'redux';

import {
  TOP_CHARTS_GET_FAILED,
  TOP_CHARTS_GET_REQUEST,
  TOP_CHARTS_GET_SUCCESS,
  TOP_CHARTS_RESET,
  TOP_CHARTS_SET_CATEGORY,
  TOP_CHARTS_SET_SORT_BY,
  TOP_CHARTS_SET_SORT_ORDER,
} from '../../constants/actions';

const hasFailed = (state = false, action) => {
  switch (action.type) {
    case TOP_CHARTS_GET_FAILED: return true;
    case TOP_CHARTS_GET_REQUEST: return false;
    case TOP_CHARTS_GET_SUCCESS: return false;
    case TOP_CHARTS_RESET: return false;
    default: return state;
  }
};

const isGetting = (state = false, action) => {
  switch (action.type) {
    case TOP_CHARTS_GET_REQUEST: return true;
    case TOP_CHARTS_GET_SUCCESS: return false;
    case TOP_CHARTS_GET_FAILED: return false;
    case TOP_CHARTS_RESET: return false;
    default: return state;
  }
};

const queryParamsInitialState = {
  category: null,
  sortBy: 'installCount',
  sortOrder: 'desc',
  page: 0,
};
const queryParams = (state = queryParamsInitialState, action) => {
  switch (action.type) {
    case TOP_CHARTS_SET_CATEGORY: {
      const { category } = action;
      return {
        ...state,
        page: 0,
        category,
      };
    }
    case TOP_CHARTS_SET_SORT_BY: {
      const { sortBy } = action;
      return {
        ...state,
        page: 0,
        sortBy,
      };
    }
    case TOP_CHARTS_SET_SORT_ORDER: {
      const { sortOrder } = action;
      return {
        ...state,
        page: 0,
        sortOrder,
      };
    }
    case TOP_CHARTS_GET_SUCCESS: {
      return {
        ...state,
        page: state.page + 1,
      };
    }
    case TOP_CHARTS_RESET: return queryParamsInitialState;
    default:
      return state;
  }
};

const apiDataInitialState = {
  apps: [],
  category: null,
  sortBy: null,
  sortOrder: null,
  totalPage: 0,
};

const apiData = (state = apiDataInitialState, action) => {
  switch (action.type) {
    case TOP_CHARTS_GET_SUCCESS: return {
      apps: state.apps.concat(action.res.apps),
      totalPage: action.res.totalPage,
    };
    case TOP_CHARTS_SET_SORT_BY:
    case TOP_CHARTS_SET_SORT_ORDER:
    case TOP_CHARTS_SET_CATEGORY: {
      return {
        ...state,
        ...apiDataInitialState,
        apps: [],
        totalPage: 0,
      };
    }
    case TOP_CHARTS_RESET: return apiDataInitialState;
    default: return state;
  }
};

export default combineReducers({
  apiData,
  hasFailed,
  isGetting,
  queryParams,
});
