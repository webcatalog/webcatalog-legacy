import { combineReducers } from 'redux';

import {
  APPS_RESET,
  APPS_SET_PAGE,
  APPS_SET_CATEGORY,
  APPS_SET_SORT_BY,
  APPS_SET_SORT_ORDER,
  APPS_GET_REQUEST,
  APPS_GET_SUCCESS,
} from '../../constants/actions';

import details from './details/reducers';

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
  page: 1,
};
const queryParams = (state = queryParamsInitialState, action) => {
  switch (action.type) {
    case APPS_SET_PAGE: {
      const { page } = action;
      return { ...state, page };
    }
    case APPS_SET_CATEGORY: {
      const { category } = action;
      return { ...state, category };
    }
    case APPS_SET_SORT_BY: {
      const { sortBy } = action;
      return { ...state, sortBy };
    }
    case APPS_SET_SORT_ORDER: {
      const { sortOrder } = action;
      return { ...state, sortOrder };
    }
    default:
      return state;
  }
};

const apiDataInitialState = {
  apps: [],
  totalPage: 0,
};
const apiData = (state = apiDataInitialState, action) => {
  switch (action.type) {
    case APPS_GET_SUCCESS: return {
      apps: state.apps.concat(action.res.apps),
      totalPage: action.res.totalPage,
    };
    case APPS_RESET: {
      const { category, sortBy, sortOrder } = state;
      return { ...apiDataInitialState, ...{ category, sortBy, sortOrder } };
    }
    default: return state;
  }
};

export default combineReducers({
  apiData,
  isGetting,
  queryParams,
  details,
});
