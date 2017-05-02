import { ipcRenderer } from 'electron';

import { REMOVE_RESULTS } from '../constants/actions';
import { LOADING } from '../constants/statuses';

import { search } from './search';
import { fetchApps } from './home';
import { fetchInstalledApps } from './installed';

export const refresh = routeId => ((dispatch, getState) => {
  const state = getState();
  if (routeId === 'search' && state.search.get('status') !== LOADING) {
    dispatch(search());
  } if (routeId === 'installed') {
    dispatch(fetchInstalledApps());
  } else if (state.home.get('status') !== LOADING) {
    dispatch({ type: REMOVE_RESULTS });
    dispatch(fetchApps());
  }

  ipcRenderer.send('scan-installed-apps');
});
