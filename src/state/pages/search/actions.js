import {
  searchFormUpdate,
  searchResultsGetFailed,
  searchResultsGetRequest,
  searchResultsGetSuccess,
} from './action-creators';

import { apiGet } from '../../api';

export const search = () =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(() => {
        const query = getState().pages.search.form.query;
        if (!query || query.length < 1) return null;

        dispatch(searchResultsGetRequest());
        return dispatch(apiGet(encodeURI(`/search/apps?q=${query}`)))
          .then((res) => {
            if (res.query !== query) return null;
            return dispatch(searchResultsGetSuccess(res));
          })
          .catch(err => dispatch(searchResultsGetFailed(err)));
      });

export const formUpdate = changes =>
  (dispatch, getState) => {
    const state = getState();
    if (state.pages.search.form.query === changes.query) return null;

    dispatch(searchFormUpdate(changes));

    return Promise.resolve()
      .then(() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 200);
        }),
      )
      .then(() => dispatch(search()));
  };
