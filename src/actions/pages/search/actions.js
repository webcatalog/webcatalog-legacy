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
        const { query } = getState().pages.search.form;
        if (!query || query.length < 1) return null;

        dispatch(searchResultsGetRequest());
        return dispatch(apiGet(encodeURI(`/search/apps?q=${query}&hitsPerPage=72`)))
          .then((res) => {
            if (res.query !== getState().pages.search.form.query) return null;
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
          }, 300);
        }))
      .then(() => dispatch(search()));
  };
