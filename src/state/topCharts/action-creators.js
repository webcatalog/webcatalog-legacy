import {
  TOP_CHARTS_GET_FAILED,
  TOP_CHARTS_GET_REQUEST,
  TOP_CHARTS_GET_SUCCESS,
  TOP_CHARTS_RESET,
  TOP_CHARTS_SET_CATEGORY,
  TOP_CHARTS_SET_SORT_BY,
  TOP_CHARTS_SET_SORT_ORDER,
} from '../../constants/actions';

export const topchartsReset = () => ({
  type: TOP_CHARTS_RESET,
});

export const topChartsGetRequest = () => ({
  type: TOP_CHARTS_GET_REQUEST,
});

export const topChartsGetSuccess = res => ({
  type: TOP_CHARTS_GET_SUCCESS,
  res,
});

export const topChartsGetFailed = res => ({
  type: TOP_CHARTS_GET_FAILED,
  res,
});

export const topChartsSetCategory = category => ({
  type: TOP_CHARTS_SET_CATEGORY,
  category,
});

export const topChartsSetSortBy = sortBy => ({
  type: TOP_CHARTS_SET_SORT_BY,
  sortBy,
});

export const topChartsSetSortOrder = sortOrder => ({
  type: TOP_CHARTS_SET_SORT_ORDER,
  sortOrder,
});
