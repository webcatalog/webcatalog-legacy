import { batchActions } from 'redux-batched-actions';
import { SET_STATUS, ADD_APPS, RESET_HOME } from '../constants/actions';
import { LOADING, FAILED, DONE } from '../constants/statuses';
import secureFetch from '../helpers/secureFetch';

import { search } from './search';
import { logOut } from './auth';

let fetching = false;

export const fetchApps = () => (dispatch, getState) => {
  const { home, auth } = getState();

  // All pages have been fetched => stop
  if (home.get('totalPage') && home.get('currentPage') + 1 === home.get('totalPage')) return;

  // Prevent redundant requests
  if (fetching) return;
  fetching = true;

  const currentPage = home.get('currentPage') + 1;

  dispatch({
    type: SET_STATUS,
    status: LOADING,
  });

  secureFetch(`/api/apps?page=${currentPage}`, auth.get('token'))
  .then(response => response.json())
  .then(({ apps, totalPage }) => {
    dispatch(batchActions([
      {
        type: SET_STATUS,
        status: DONE,
      },
      {
        type: ADD_APPS,
        chunk: apps,
        currentPage,
        totalPage,
      },
    ]));
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */
    if (err.message === 'Unauthorized') {
      dispatch(logOut());
      return;
    }

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
