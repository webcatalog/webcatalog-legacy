import {
  myAppsGetFailed,
  myAppsGetRequest,
  myAppsGetSuccess,
  myAppsReset,
} from './action-creators';

import { apiGet } from '../../api';

const buildQueryParamsUrl = (url, queryParams) => {
  let queryParamsPath = url;

  if (queryParams.page) queryParamsPath += `&page=${queryParams.page}`;

  return queryParamsPath;
};

export const getMyApps = () =>
  (dispatch, getState) => {
    const state = getState();

    const {
      apiData,
      isGetting,
      queryParams,
    } = state.pages.myApps;

    const { totalPage } = apiData;
    const { page } = queryParams;

    if (isGetting) return;

    // If all pages have already been fetched, we stop
    if (totalPage && page + 1 > totalPage) return;

    dispatch(myAppsGetRequest());
    dispatch(apiGet(buildQueryParamsUrl('/user/apps?limit=48', queryParams)))
      .then(res => dispatch(myAppsGetSuccess({ ...res })))
      .catch(() => dispatch(myAppsGetFailed()));
  };

export const resetAndGetMyApps = () =>
  (dispatch) => {
    dispatch(myAppsReset());
    dispatch(getMyApps());
  };
