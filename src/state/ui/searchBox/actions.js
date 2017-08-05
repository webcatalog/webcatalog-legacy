import algoliasearch from 'algoliasearch';
import {
  searchBoxClose,
  searchBoxOpen,
  searchFormUpdate,
  searchResultsGetRequest,
  searchResultsGetSuccess,
} from './action-creators';

const client = algoliasearch(
  process.env.REACT_APP_ALGOLIASEARCH_APPLICATION_ID,
  process.env.REACT_APP_ALGOLIASEARCH_API_KEY_SEARCH,
);
const index = client.initIndex('apps');

export const closeSearchBox = () =>
  dispatch => dispatch(searchBoxClose());

export const openSearchBox = () =>
  dispatch => dispatch(searchBoxOpen());

export const formUpdate = changes =>
  (dispatch, getState) => {
    if (getState().ui.searchBox.form.query === changes.query) return null;

    dispatch(searchFormUpdate(changes));
    return Promise.resolve()
      .then(() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 200);
        }),
      )
      .then(() => {
        if (!changes.query || changes.query.length < 1) return null;
        if (getState().ui.searchBox.form.query !== changes.query) return null;

        dispatch(searchResultsGetRequest());
        return index.search(changes.query, { hitsPerPage: 48 })
          .then((res) => {
            if (res.query !== changes.query) return null;
            return dispatch(searchResultsGetSuccess(res));
          });
      });
  };
