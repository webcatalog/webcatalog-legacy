import { batchActions } from 'redux-batched-actions';

import {
  SET_SEARCH_QUERY, SET_SEARCH_HITS, SET_SEARCH_STATUS,
  LOADING, FAILED, DONE,
} from '../constants/actions';
import searchAsync from '../helpers/searchAsync';

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

  searchAsync({ query, params: { hitsPerPage: 100 } })
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
