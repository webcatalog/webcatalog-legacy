import {
  APPS_GET_REQUEST,
  APPS_GET_SUCCESS,
  APPS_SET_CATEGORY,
  APPS_SET_SORT_BY,
  APPS_SET_SORT_ORDER,
  APPS_RESET,
} from '../../constants/actions';

export const appsGetRequest = () => ({
  type: APPS_GET_REQUEST,
});

export const appsGetSuccess = () => ({
  type: APPS_GET_SUCCESS,
});

export const appsSetCategory = category => ({
  type: APPS_SET_CATEGORY,
  category,
});

export const appsSetSortBy = sortBy => ({
  type: APPS_SET_SORT_BY,
  sortBy,
});

export const appsSetSortOrder = sortOrder => ({
  type: APPS_SET_SORT_ORDER,
  sortOrder,
});

export const appsReset = () => ({
  type: APPS_RESET,
});
