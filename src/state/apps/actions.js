import {
  appsGetRequest,
  appsGetSuccess,
  appsSetPage,
  appsSetCategory,
  appsSetSortBy,
  appsSetSortOrder,
  appsReset,
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
      queryParams,
    } = state.apps;

    const totalPage = apiData.totalPage;
    const page = queryParams.page;

    // If all pages have already been fetched, we stop
    if (totalPage && page + 1 > totalPage) return;

    // If we pass in the 'next' parameter, we increment the page
    const currentPage = next ? page + 1 : page;

    dispatch(appsGetRequest());
    dispatch(apiGet(buildQueryParamsUrl(`/apps?limit=30&page=${currentPage}`, queryParams)))
      .then(res => res.json())
      .then(res => dispatch(appsGetSuccess(res)))
      .catch(() => {});
  };

export const setPage = page => (dispatch) => {
  dispatch(appsSetPage(page));
  dispatch(appsReset());
  dispatch(getApps());
};

export const setCategory = category => (dispatch) => {
  dispatch(appsSetCategory(category));
  dispatch(appsReset());
  dispatch(getApps());
};

export const setSortBy = (sortBy, sortOrder) => (dispatch) => {
  dispatch(appsSetSortOrder(sortOrder));
  dispatch(appsSetSortBy(sortBy));
  dispatch(appsReset());
  dispatch(getApps());
};
