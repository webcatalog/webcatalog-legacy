import {
  SET_HOME_STATUS,
  ADD_HOME_APPS,
} from '../../constants/actions';
import {
  appsGetRequest,
  appsGetSuccess,
  appsSetCategory,
  appsSetSortBy,
  appsSetSortOrder,
  appsReset,
} from './action-creators';
import {
  LOADING,
  FAILED,
  DONE,
} from '../../constants/statuses';
import { apiGet } from '../../actions/api';

let fetching = false;


export const getApps = ({ next = false } = {}) =>
  (dispatch, getState) => {
    const {
      apiData,
      queryParams,
    } = getState().apps;

    // All pages have been fetched => stop
    if (apiData.totalPage && apiData.currentPage + 1 > apiData.totalPage) return;

    // Prevent redundant requests
    if (fetching) return;
    fetching = true;

    // We increment the page if we pass in the 'next' parameter
    const currentPage = next ? apiData.currentPage + 1 : apiData.currentPage;

    dispatch(appsGetRequest());
    dispatch({
      type: SET_HOME_STATUS,
      status: LOADING,
    });

    let requestPath = `/apps?limit=30&page=${currentPage}`;
    if (queryParams.category) requestPath += `&category=${encodeURIComponent(queryParams.category)}`;
    if (queryParams.sortBy) requestPath += `&sort=${queryParams.sortBy}`;
    if (queryParams.sortOrder) requestPath += `&order=${queryParams.sortOrder}`;

    dispatch(apiGet(requestPath))
      .then((response) => {
        dispatch(appsGetSuccess());
        return response.json();
      })
      .then(({ apps, totalPage }) =>
        Promise.all([
          dispatch(appsGetSuccess()),
          dispatch({ type: SET_HOME_STATUS, status: DONE }),
          dispatch({
            type: ADD_HOME_APPS,
            chunk: apps,
            currentPage,
            totalPage,
          }),
        ]),
      )
      .catch((err) => {
        if (err && err.response && err.response.status === 401) {
          // dispatch(logOut());
          return;
        }

        /* eslint-disable no-console */
        console.log(err);
        /* eslint-enable no-console */

        dispatch({
          type: SET_HOME_STATUS,
          status: FAILED,
        });
      })
      .then(() => {
        fetching = false;
      });
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
