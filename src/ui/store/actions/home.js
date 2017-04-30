/* global fetch */

import { batchActions } from 'redux-batched-actions';
import { SET_STATUS, ADD_APPS, RESET_HOME } from '../constants/actions';
import { LOADING, FAILED, DONE } from '../constants/statuses';
import getServerUrl from '../helpers/getServerUrl';
import checkFetchStatus from '../helpers/checkFetchStatus';

import { search } from './search';

let fetching = false;

export const fetchApps = () => (dispatch, getState) => {
  const homeState = getState().home;

  // All pages have been fetched => stop
  if (homeState.get('totalPage') && homeState.get('currentPage') + 1 === homeState.get('totalPage')) return;

  // Prevent redundant requests
  if (fetching) return;
  fetching = true;

  const currentPage = homeState.get('currentPage') + 1;

  dispatch({
    type: SET_STATUS,
    status: LOADING,
  });

  fetch(getServerUrl('/api/apps'))
  .then(checkFetchStatus)
  .then(response => response.json())
  .then((chunk) => {
    dispatch(batchActions([
      {
        type: SET_STATUS,
        status: DONE,
      },
      {
        type: ADD_APPS,
        chunk,
        currentPage,
        totalPage: 1,
      },
    ]));
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log(err.message);
    /* eslint-enable no-console */

    dispatch({
      type: SET_STATUS,
      status: FAILED,
    });
  })
  .then(() => {
    fetching = false;
  });
};

export const refresh = pathname => ((dispatch, getState) => {
  const state = getState();
  if (pathname === '/search' && state.search.get('status') !== LOADING) {
    dispatch(search());
  } else if (state.home.get('status') !== LOADING) {
    dispatch({ type: RESET_HOME });
    dispatch(fetchApps());
  }
});
