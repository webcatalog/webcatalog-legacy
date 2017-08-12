import {
  topChartsGetFailed,
  topChartsGetRequest,
  topChartsGetSuccess,
  topChartsSetCategory,
  topChartsSetSortBy,
  topChartsSetSortOrder,
} from './action-creators';
import { apiGet } from '../api';

const buildQueryParamsUrl = (url, queryParams) => {
  let queryParamsPath = url;

  if (queryParams.category) queryParamsPath += `&category=${encodeURIComponent(queryParams.category)}`;
  if (queryParams.sortBy) queryParamsPath += `&sort=${queryParams.sortBy}`;
  if (queryParams.sortOrder) queryParamsPath += `&order=${queryParams.sortOrder}`;

  return queryParamsPath;
};

export const getApps = ({ next = false } = {}) =>
  (dispatch, getState) => {
    const state = getState();

    const {
      apiData,
      isGetting,
      queryParams,
    } = state.topCharts;

    if (isGetting) return;

    const totalPage = apiData.totalPage;
    const page = queryParams.page;

    // If all pages have already been fetched, we stop
    if (totalPage && page + 1 > totalPage) return;

    // If we pass in the 'next' parameter, we increment the page
    const currentPage = next ? page + 1 : page;

    dispatch(topChartsGetRequest());
    dispatch(apiGet(buildQueryParamsUrl(`/apps?limit=48&page=${currentPage}`, queryParams)))
      .then(res => res.json())
      .then(res => dispatch(topChartsGetSuccess(res)))
      .catch(() => dispatch(topChartsGetFailed()));
  };

export const setCategory = category => (dispatch) => {
  dispatch(topChartsSetCategory(category));
  dispatch(getApps());
};

export const setSortBy = (sortBy, sortOrder) => (dispatch) => {
  dispatch(topChartsSetSortOrder(sortOrder));
  dispatch(topChartsSetSortBy(sortBy));
  dispatch(getApps());
};
