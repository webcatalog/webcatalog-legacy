import { LOADING } from '../../constants/statuses';
import {
  SET_HOME_STATUS,
  ADD_HOME_APPS,
  RESET_HOME_APPS,
  SET_HOME_CATEGORY,
  SET_HOME_SORT_BY,
  SET_HOME_SORT_ORDER,
  APPS_GET_REQUEST,
  APPS_GET_SUCCESS,
} from '../../constants/actions';

const initialState = {
  status: LOADING,
  apps: [],
  currentPage: 1,
  totalPage: null,
  appStatus: {},
  category: null,
  sortBy: 'installCount',
  sortOrder: 'desc',
  isGettingApps: false,
};

const home = (state = initialState, action) => {
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
    case RESET_HOME_APPS: {
      // Keep category and sort option
      const { category, sortBy, sortOrder } = state;

      return Object.assign({}, initialState, {
        category, sortBy, sortOrder,
      });
    }
    case SET_HOME_CATEGORY: {
      const { category } = action;
      return Object.assign({}, state, { category });
    }
    case SET_HOME_SORT_BY: {
      const { sortBy } = action;
      return Object.assign({}, state, { sortBy });
    }
    case SET_HOME_SORT_ORDER: {
      const { sortOrder } = action;
      return Object.assign({}, state, { sortOrder });
    }
    case APPS_GET_REQUEST: {
      return Object.assign({}, state, { isGettingApps: true });
    }
    case APPS_GET_SUCCESS: {
      return Object.assign({}, state, { isGettingApps: false });
    }
    default:
      return state;
  }
};

export default home;
