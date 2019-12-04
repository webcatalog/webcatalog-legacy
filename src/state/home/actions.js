import algoliasearch from 'algoliasearch';

import {
  homeGetFailed,
  homeGetRequest,
  homeGetSuccess,
  homeReset,
  homeUpdateCurrentQuery,
  homeUpdateQuery,
} from './action-creators';

const client = algoliasearch('4TX8Z3FKMI', '57f6e815e97deb2cdf74f49c852bc232');
const index = client.initIndex('apps');

export const getHits = () => (dispatch, getState) => {
  const state = getState();

  const {
    isGetting,
    page,
    query,
    totalPage,
  } = state.home;

  if (isGetting) return;

  // If all pages have already been fetched, we stop
  if (totalPage && page + 1 > totalPage) return;

  dispatch(homeUpdateCurrentQuery(query));
  dispatch(homeGetRequest());

  index.search({
    query,
    page: page + 1,
    hitsPerPage: 40,
  })
    .then((res) => dispatch(homeGetSuccess({
      hits: res.hits,
      page: res.page,
      totalPage: res.nbPages,
    })))
    .catch(() => dispatch(homeGetFailed()));
};

export const resetThenGetHits = () => (dispatch) => {
  dispatch(homeReset());
  dispatch(getHits());
};

export const updateQuery = (query) => (dispatch, getState) => {
  const state = getState();

  const {
    currentQuery,
  } = state.home;

  dispatch(homeUpdateQuery(query));
  if (query === '' && currentQuery !== query) {
    dispatch(resetThenGetHits());
  }
};
