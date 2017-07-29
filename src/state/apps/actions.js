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
    const { home } = getState();

    // All pages have been fetched => stop
    if (home.totalPage && home.currentPage + 1 > home.totalPage) return;

    // Prevent redundant requests
    if (fetching) return;
    fetching = true;

    // We increment the page if we pass in the 'next' parameter
    const currentPage = next ? home.currentPage + 1 : home.currentPage;

    dispatch(appsGetRequest());
    dispatch({
      type: SET_HOME_STATUS,
      status: LOADING,
    });

    let requestPath = `/apps?limit=30&page=${currentPage}`;
    if (home.category) requestPath += `&category=${encodeURIComponent(home.category)}`;
    if (home.sortBy) requestPath += `&sort=${home.sortBy}`;
    if (home.sortOrder) requestPath += `&order=${home.sortOrder}`;

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
