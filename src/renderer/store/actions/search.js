import algoliasearch from 'algoliasearch';
import { batchActions } from 'redux-batched-actions';

import { SET_SEARCH_QUERY, SET_SEARCH_HITS, SET_SEARCH_STATUS } from '../constants/actions';
import { LOADING, FAILED, DONE } from '../constants/statuses';

export const setSearchQuery = query => (dispatch) => {
  dispatch(batchActions([
    { type: SET_SEARCH_QUERY, query },
    { type: SET_SEARCH_STATUS, status: LOADING },
  ]));
};

export const search = () => (dispatch, getState) => {
  const query = getState().search.get('query');

  if (!query || query.length < 1) return;

  dispatch({
    type: SET_SEARCH_STATUS,
    status: LOADING,
  });

  const client = algoliasearch(
    process.env.ALGOLIASEARCH_APPLICATION_ID,
    process.env.ALGOLIASEARCH_API_KEY_SEARCH,
  );
  const index = client.initIndex(process.env.ALGOLIASEARCH_INDEX_NAME);
  index.search(query, { hitsPerPage: 48 })
    .then((content) => {
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
    })
    .catch((err) => {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
      dispatch({
        type: SET_SEARCH_STATUS,
        status: FAILED,
      });
    });
};
