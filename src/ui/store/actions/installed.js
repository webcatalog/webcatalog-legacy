import { batchActions } from 'redux-batched-actions';

import {
  SET_INSTALLED_HITS, SET_INSTALLED_STATUS,
  LOADING, FAILED, DONE,
} from '../constants/actions';

import scanInstalledAsync from '../helpers/scanInstalledAsync';
import getObjectsAsync from '../helpers/getObjectsAsync';
import getAllAppPath from '../helpers/getAllAppPath';

export const fetchInstalled = () => (dispatch) => {
  dispatch({
    type: SET_INSTALLED_STATUS,
    status: LOADING,
  });


  scanInstalledAsync({ allAppPath: getAllAppPath() })
    .then((installedApps) => {
      const objectIds = installedApps.filter(({ id }) => !id.startsWith('custom-')).map(({ id }) => id);
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

      getObjectsAsync({ objectIds })
        .then((content) => {
          const hits = content.results ? content.results.filter(hit => hit !== null) : [];

          const customApps = installedApps.filter(({ id }) => id.startsWith('custom-'));

          dispatch(batchActions([
            {
              type: SET_INSTALLED_STATUS,
              status: DONE,
            },
            {
              type: SET_INSTALLED_HITS,
              hits: hits.concat(customApps),
            },
          ]));
        })
        .catch((err) => {
          /* eslint-disable no-console */
          console.log(err);
          /* eslint-enable no-console */
          dispatch({
            type: SET_INSTALLED_STATUS,
            status: FAILED,
          });
        });
    });
};
