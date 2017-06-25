import { batchActions } from 'redux-batched-actions';
import { SET_MY_APPS_STATUS, ADD_MY_APPS_APPS, REMOVE_MY_APPS_RESULTS } from '../constants/actions';
import { LOADING, FAILED, DONE } from '../constants/statuses';
import secureFetch from '../libs/secureFetch';

import { logOut } from './auth';

let fetching = false;

export const removeMyAppsResults = () => ({
  type: REMOVE_MY_APPS_RESULTS,
});

export const fetchMyApps = () => (dispatch, getState) => {
  const { myApps, auth } = getState();

  if (!auth.get('token')) {
    return;
  }

  // All pages have been fetched => stop
  if (myApps.get('totalPage') && myApps.get('currentPage') + 1 > myApps.get('totalPage')) return;

  // Prevent redundant requests
  if (fetching) return;
  fetching = true;

  const currentPage = myApps.get('currentPage') + 1;

  dispatch({
    type: SET_MY_APPS_STATUS,
    status: LOADING,
  });

  secureFetch('/api/user/apps', auth.get('token'))
  .then(response => response.json())
  .then(({ apps, totalPage }) => {
    dispatch(batchActions([
      {
        type: SET_MY_APPS_STATUS,
        status: DONE,
      },
      {
        type: ADD_MY_APPS_APPS,
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
      type: SET_MY_APPS_STATUS,
      status: FAILED,
    });
  })
  .then(() => {
    fetching = false;
  });
};
