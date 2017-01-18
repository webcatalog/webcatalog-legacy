import algoliasearch from 'algoliasearch';
import { batchActions } from 'redux-batched-actions';

import { ALGOLIA_APPLICATION_ID, ALGOLIA_APPLICATION_KEY } from '../constants/algolia';
import {
  SET_SEARCH_QUERY, SET_SEARCH_HITS, SET_SEARCH_STATUS,
  LOADING, FAILED, DONE,
} from '../constants/actions';

export const setSearchQuery = query => (dispatch) => {
  dispatch(batchActions([
    {
      type: SET_SEARCH_QUERY,
      query,
    },
    {
      type: SET_SEARCH_STATUS,
      status: LOADING,
    },
  ]));
};

export const search = () => (dispatch, getState) => {
  const query = getState().search.query;

  if (!query || query.length < 1) return;

  dispatch({
    type: SET_SEARCH_STATUS,
    status: LOADING,
  });

  const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_APPLICATION_KEY);
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
