import { batchActions } from 'redux-batched-actions';
import { SET_HOME_STATUS, ADD_HOME_APPS, REMOVE_HOME_RESULTS, SET_CATEGORY, SET_SORT } from '../constants/actions';
import { LOADING, FAILED, DONE } from '../constants/statuses';
import secureFetch from '../libs/secureFetch';

import { logOut } from './auth';

let fetching = false;

export const fetchApps = () => (dispatch, getState) => {
  const { home, auth } = getState();

  // All pages have been fetched => stop
  if (home.get('totalPage') && home.get('currentPage') + 1 > home.get('totalPage')) return;

  // Prevent redundant requests
  if (fetching) return;
  fetching = true;

  const currentPage = home.get('currentPage') + 1;

  dispatch({
    type: SET_HOME_STATUS,
    status: LOADING,
  });

  let requestPath = `/api/apps?page=${currentPage}`;
  if (home.get('category')) requestPath += `&category=${encodeURIComponent(home.get('category'))}`;
  if (home.get('sort')) requestPath += `&sort=${home.get('sort')}`;

  secureFetch(requestPath, auth.get('token'))
  .then(response => response.json())
  .then(({ apps, totalPage }) => {
    dispatch(batchActions([
      {
        type: SET_HOME_STATUS,
        status: DONE,
      },
      {
        type: ADD_HOME_APPS,
        chunk: apps,
        currentPage,
        totalPage,
      },
    ]));
  })
  .catch((err) => {
    if (err && err.response && err.response.status === 401) {
      dispatch(logOut());
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
  dispatch(batchActions([
    { type: SET_CATEGORY, category },
    { type: REMOVE_HOME_RESULTS },
  ]));
  dispatch(fetchApps());
};

export const setSort = sort => (dispatch) => {
  dispatch(batchActions([
    { type: SET_SORT, sort },
    { type: REMOVE_HOME_RESULTS },
  ]));
  dispatch(fetchApps());
};
