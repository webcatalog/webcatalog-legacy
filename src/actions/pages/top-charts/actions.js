import {
  topChartsGetFailed,
  topChartsGetRequest,
  topChartsGetSuccess,
  topchartsReset,
} from './action-creators';
import { apiGet } from '../../api';

const buildQueryParamsUrl = (url, queryParams) => {
  let queryParamsPath = url;

  if (queryParams.category) queryParamsPath += `&category=${encodeURIComponent(queryParams.category)}`;
  if (queryParams.sortBy) queryParamsPath += `&sort=${queryParams.sortBy}`;
  if (queryParams.sortOrder) queryParamsPath += `&order=${queryParams.sortOrder}`;

  return queryParamsPath;
};

export const getApps = () =>
  (dispatch, getState) => {
    const state = getState();

    const {
      apiData,
      isGetting,
      queryParams,
    } = state.pages.topCharts;

    if (isGetting) return;

    const { totalPage } = apiData;
    const { page } = queryParams;

    // If all pages have already been fetched, we stop
    if (totalPage && page + 1 > totalPage) return;

    // If we pass in the 'next' parameter, we increment the page
    const currentPage = page + 1;

    dispatch(topChartsGetRequest());
    dispatch(apiGet(buildQueryParamsUrl(`/apps?limit=48&page=${currentPage}`, queryParams)))
      .then(res => dispatch(topChartsGetSuccess(res)))
      .catch(() => dispatch(topChartsGetFailed()));
  };

export const resetAndGetApps = () =>
  (dispatch) => {
    dispatch(topchartsReset());
    dispatch(getApps());
  };
