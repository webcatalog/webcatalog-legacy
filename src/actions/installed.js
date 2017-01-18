import algoliasearch from 'algoliasearch';
import { batchActions } from 'redux-batched-actions';

import { ALGOLIA_APPLICATION_ID, ALGOLIA_APPLICATION_KEY } from '../constants/algolia';
import {
  SET_INSTALLED_HITS, SET_INSTALLED_STATUS,
  LOADING, FAILED, DONE,
} from '../constants/actions';

import scanInstalledAsync from '../helpers/scanInstalledAsync';
import getAllAppPath from '../helpers/getAllAppPath';


export const fetchInstalled = () => (dispatch) => {
  dispatch({
    type: SET_INSTALLED_STATUS,
    status: LOADING,
  });

  scanInstalledAsync(getAllAppPath())
    .then((objectIds) => {
      if (objectIds.length < 1) {
        dispatch(batchActions([
          {
            type: SET_INSTALLED_STATUS,
            status: DONE,
          },
          {
            type: SET_INSTALLED_HITS,
            hits: [],
          },
        ]));
        return;
      }

      const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_APPLICATION_KEY);
      const index = client.initIndex('webcatalog');
      index.getObjects(objectIds, (err, content) => {
        if (err) {
          dispatch({
            type: SET_INSTALLED_STATUS,
            status: FAILED,
          });
          return;
        }

        dispatch(batchActions([
          {
            type: SET_INSTALLED_STATUS,
            status: DONE,
          },
          {
            type: SET_INSTALLED_HITS,
            hits: (content.results && content.results.length > 0 && content.results[0] !== null)
                  ? content.results : [],
          },
        ]));
      });
    });
};
