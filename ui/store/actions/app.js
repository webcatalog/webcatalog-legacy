/* global fetch execFile remote fs */
import { batchActions } from 'redux-batched-actions';
import {
  SET_STATUS, ADD_APPS, ADD_APP_STATUS, REMOVE_APP_STATUS, RESET_APP, SET_INSTALLED_HITS,
  INSTALLED, INPROGRESS, LOADING, FAILED, DONE,
} from '../constants/actions';
import scanInstalledAsync from '../helpers/scanInstalledAsync';
import installAppAsync from '../helpers/installAppAsync';
import uninstallAppAsync from '../helpers/uninstallAppAsync';
import updateAppsAsync from '../helpers/updateAppsAsync';
import getAllAppPath from '../helpers/getAllAppPath';
import searchAsync from '../helpers/searchAsync';

import { search } from './search';
import { fetchInstalled } from './installed';

let fetching = false;

export const fetchApps = () => (dispatch, getState) => {
  const appState = getState().app;

  // All pages have been fetched => stop
  if (appState.totalPage && appState.currentPage + 1 === appState.totalPage) return;

  // Prevent redundant requests
  if (fetching) return;
  fetching = true;

  const currentPage = appState.currentPage + 1;

  dispatch({
    type: SET_STATUS,
    status: LOADING,
  });

  searchAsync({
    query: null,
    params: { page: currentPage, hitsPerPage: 24 },
  })
  .then((content) => {
    dispatch(batchActions([
      {
        type: SET_STATUS,
        status: DONE,
      },
      {
        type: ADD_APPS,
        chunk: content.hits,
        currentPage,
        totalPage: content.nbPages,
      },
    ]));
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */

    dispatch({
      type: SET_STATUS,
      status: FAILED,
    });
  })
  .then(() => {
    fetching = false;
  });
};


export const installApp = app => (dispatch) => {
  dispatch({
    type: ADD_APP_STATUS,
    id: app.get('id'),
    status: INPROGRESS,
  });

  installAppAsync({
    allAppPath: getAllAppPath(),
    appId: app.get('id'),
    appName: app.get('name'),
    appUrl: app.get('url'),
  })
  .then(() => {
    dispatch({
      type: ADD_APP_STATUS,
      id: app.get('id'),
      status: INSTALLED,
    });
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */
    dispatch({
      type: REMOVE_APP_STATUS,
      id: app.get('id'),
    });
  });
};


export const uninstallApp = app => ((dispatch, getState) => {
  dispatch({
    type: ADD_APP_STATUS,
    id: app.get('id'),
    status: INPROGRESS,
  });


  uninstallAppAsync({
    allAppPath: getAllAppPath(),
    appId: app.get('id'),
    appName: app.get('name'),
  })
  .then(() => {
    dispatch({
      type: REMOVE_APP_STATUS,
      id: app.get('id'),
    });

    // update installed page
    const { installed } = getState();
    if (installed.status !== LOADING && installed.hits && installed.hits.size > 0) {
      dispatch({
        type: SET_INSTALLED_HITS,
        hits: installed.hits.filter(hit => (hit.get('id') !== app.get('id'))),
      });
    }
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */
    dispatch({
      type: REMOVE_APP_STATUS,
      id: app.get('id'),
    });
  });
});


export const scanInstalledApps = () => ((dispatch) => {
  scanInstalledAsync({
    allAppPath: getAllAppPath(),
  })
    .then((installedApps) => {
      // update Apps
      updateAppsAsync({
        allAppPath: getAllAppPath(),
        installedApps,
      })
      .then(() => {
        /* eslint-disable no-console */
        console.log('Updating all apps successfully');
        /* eslint-enable no-console */
      })
      .catch((err) => {
        /* eslint-disable no-console */
        console.log(err);
        /* eslint-enable no-console */
      });

      installedApps.map(({ id }) => id).forEach((id) => {
        dispatch({
          type: ADD_APP_STATUS,
          id,
          status: INSTALLED,
        });
      });
    });
});

export const refresh = pathname => ((dispatch, getState) => {
  const state = getState();
  if (pathname === '/search' && state.search.status !== LOADING) {
    dispatch(search());
  } else if (pathname === '/installed' && state.installed.status !== LOADING) {
    dispatch(fetchInstalled());
  } else if (state.app.status !== LOADING) {
    dispatch({ type: RESET_APP });
    dispatch(fetchApps());
  }
});
