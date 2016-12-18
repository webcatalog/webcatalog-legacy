import algoliasearch from 'algoliasearch';
import { batchActions } from 'redux-batched-actions';

import {
  SET_SEARCH_QUERY, SET_SEARCH_HITS, SET_SEARCH_STATUS,
  LOADING, FAILED, DONE, NONE,
} from '../constants/actions';

export const setSearchQuery = query => (dispatch) => {
  dispatch({
    type: SET_SEARCH_QUERY,
    query,
  });

  if (!query || query.length < 1) {
    dispatch({
      type: SET_SEARCH_STATUS,
      status: NONE,
    });
  }
};

export const search = () => (dispatch, getState) => {
  const query = getState().search.query;

  if (!query || query.length < 1) return;

  dispatch({
    type: SET_SEARCH_STATUS,
    status: LOADING,
  });

  const client = algoliasearch('PFL0LPV96S', '2b9f5f768d387b7239ce0b21106373e9');
  const index = client.initIndex('webcatalog');

  index.search(query, (err, content) => {
    if (err) {
      dispatch({
        type: SET_SEARCH_STATUS,
        status: FAILED,
      });
      return;
    }

    dispatch(batchActions([
      {
        type: SET_SEARCH_STATUS,
        status: DONE,
      },
      {
        type: SET_SEARCH_HITS,
        hits: content.hits,
      },
    ]));
  });
};
