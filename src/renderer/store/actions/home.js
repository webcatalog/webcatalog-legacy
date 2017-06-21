import {
  SET_HOME_STATUS,
  ADD_HOME_APPS,
  RESET_HOME_APPS,
  SET_HOME_CATEGORY,
  SET_HOME_SORT_BY,
} from '../constants/actions';
import {
  LOADING,
  FAILED,
  DONE,
} from '../constants/statuses';

let fetching = false;

export const fetchApps = () => (dispatch, getState) => {
  const { home } = getState();

  // All pages have been fetched => stop
  if (home.totalPage && home.currentPage + 1 > home.totalPage) return;

  // Prevent redundant requests
  if (fetching) return;
  fetching = true;

  const currentPage = home.currentPage + 1;

  dispatch({
    type: SET_HOME_STATUS,
    status: LOADING,
  });

  let requestPath = `https://getwebcatalog.com/api/apps?page=${currentPage}`;
  if (home.category) requestPath += `&category=${encodeURIComponent(home.category)}`;
  if (home.sortBy) requestPath += `&sort=${home.sortBy}`;

  fetch(requestPath)
  .then(response => response.json())
  .then(({ apps, totalPage }) =>
    Promise.all([
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
  dispatch({ type: SET_HOME_CATEGORY, category });
  dispatch({ type: RESET_HOME_APPS });

  dispatch(fetchApps());
};

export const setSortBy = sortBy => (dispatch) => {
  dispatch({ type: SET_HOME_SORT_BY, sortBy });
  dispatch({ type: RESET_HOME_APPS });

  dispatch(fetchApps());
};
