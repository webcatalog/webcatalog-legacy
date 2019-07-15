import algoliasearch from 'algoliasearch';

import {
  directoryGetFailed,
  directoryGetRequest,
  directoryGetSuccess,
  directoryReset,
  directoryUpdateCurrentQuery,
  directoryUpdateQuery,
} from './action-creators';

const client = algoliasearch('AF0RQHAAUC', '35e90aa0584895eeabd2249df79d8252');
const index = client.initIndex('apps');

export const getHits = () =>
  (dispatch, getState) => {
    const state = getState();

    const {
      isGetting,
      page,
      query,
      totalPage,
    } = state.directory;

    if (isGetting) return;

    // If all pages have already been fetched, we stop
    if (totalPage && page + 1 > totalPage) return;

    dispatch(directoryUpdateCurrentQuery(query));
    dispatch(directoryGetRequest());

    index.search({
      query,
      page: page + 1,
      hitsPerPage: 24,
    })
      .then(res => dispatch(directoryGetSuccess({
        hits: res.hits,
        page: res.page,
        totalPage: res.nbPages,
      })))
      .catch(() => dispatch(directoryGetFailed()));
  };

export const resetThenGetHits = () =>
  (dispatch) => {
    dispatch(directoryReset());
    dispatch(getHits());
  };

export const updateQuery = query =>
  (dispatch, getState) => {
    const state = getState();

    const {
      currentQuery,
    } = state.directory;

    dispatch(directoryUpdateQuery(query));
    if (query === '' && currentQuery !== query) {
      dispatch(resetThenGetHits());
    }
  };
