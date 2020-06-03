import algoliasearch from 'algoliasearch';

import {
  homeGetFailed,
  homeGetRequest,
  homeGetSuccess,
  homeReset,
  homeUpdateCurrentQuery,
  homeUpdateQuery,
  homeUpdateScrollOffset,
} from './action-creators';

const client = algoliasearch('4TX8Z3FKMI', '57f6e815e97deb2cdf74f49c852bc232');
const index = client.initIndex('apps');

export const getHits = () => (dispatch, getState) => {
  const state = getState();

  const {
    isGetting,
    page,
    currentQuery,
    totalPage,
  } = state.home;

  if (isGetting) return;

  // If all pages have already been fetched, we stop
  if (totalPage && page + 1 >= totalPage) return;

  dispatch(homeGetRequest());

  index.search(currentQuery, {
    page: page + 1,
    hitsPerPage: 42,
  })
    .then((res) => dispatch(homeGetSuccess({
      hits: res.hits,
      page: res.page,
      totalPage: res.nbPages,
    })))
    .catch(() => dispatch(homeGetFailed()));
};

export const resetThenGetHits = () => (dispatch, getState) => {
  const state = getState();
  const { query } = state.home;

  dispatch(homeReset());
  dispatch(homeUpdateCurrentQuery(query));
  dispatch(getHits());
};

let timeout = null;
export const updateQuery = (query) => (dispatch, getState) => {
  const state = getState();

  const {
    currentQuery,
  } = state.home;

  dispatch(homeUpdateQuery(query));

  clearTimeout(timeout);
  if (currentQuery !== query) {
    if (query === '') {
      dispatch(resetThenGetHits());
    } else {
      timeout = setTimeout(() => {
        dispatch(resetThenGetHits());
      }, 300);
    }
  }
};

export const updateScrollOffset = (scrollOffset) => homeUpdateScrollOffset(scrollOffset);
