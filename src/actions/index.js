/* global fetch */
import Immutable from 'immutable';

import {
  UPDATE_APP,
} from '../constants/actions';

export const fetchApps = () => ((dispatch, getState) => {
  const appState = getState().app;

  // All pages have been fetched => stop
  if (appState.totalPage && appState.currentPage + 1 === appState.totalPage) return;

  const currentPage = appState.currentPage ? appState.currentPage + 1 : 0;

  fetch(`https://backend.getwebcatalog.com/${currentPage}.json`)
    .then(response => response.json())
    .then((result) => {
      let apps;
      if (appState.apps) {
        apps = appState.apps.concat(Immutable.fromJS(result.chunk));
      } else {
        apps = Immutable.fromJS(result.chunk);
      }

      dispatch({
        type: UPDATE_APP,
        apps,
        status: 'done',
        currentPage,
        totalPage: result.totalPage,
      });
    });
});
