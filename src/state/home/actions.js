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
    .then((res) => {
      if (currentQuery !== getState().home.currentQuery) {
        return;
      }
      dispatch(homeGetSuccess({
        hits: res.hits,
        page: res.page,
        totalPage: res.nbPages,
      }));
    })
    .catch(() => {
      if (currentQuery !== getState().home.currentQuery) {
        return;
      }
      dispatch(homeGetFailed());
    });
};

export const resetThenGetHits = (forceClearCache) => (dispatch, getState) => {
  const state = getState();
  const { query } = state.home;

  if (forceClearCache) {
    client.clearCache();
  }

  dispatch(homeReset());
  dispatch(homeUpdateCurrentQuery(query));
  dispatch(getHits());
};

export const updateQuery = (query) => homeUpdateQuery(query);

export const updateScrollOffset = (scrollOffset) => homeUpdateScrollOffset(scrollOffset);
