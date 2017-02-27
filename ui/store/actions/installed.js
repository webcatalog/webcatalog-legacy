import { batchActions } from 'redux-batched-actions';

import {
  SET_INSTALLED_HITS, SET_INSTALLED_STATUS,
  LOADING, FAILED, DONE,
} from '../constants/actions';

import scanInstalledAsync from '../helpers/scanInstalledAsync';
import fetchAppDataAsync from '../helpers/fetchAppDataAsync';
import getAllAppPath from '../helpers/getAllAppPath';


export const fetchInstalled = () => (dispatch) => {
  dispatch({
    type: SET_INSTALLED_STATUS,
    status: LOADING,
  });


  scanInstalledAsync({ allAppPath: getAllAppPath() })
    .then((installedIds) => {
      const objectIds = installedIds.map(({ id }) => id);
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

      fetchAppDataAsync({ objectIds })
        .then((hits) => {
          dispatch(batchActions([
            {
              type: SET_INSTALLED_STATUS,
              status: DONE,
            },
            {
              type: SET_INSTALLED_HITS,
              hits,
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
