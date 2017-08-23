import { REMOVE_HOME_RESULTS, REMOVE_MY_APPS_RESULTS } from '../constants/actions';
import { LOADING } from '../constants/statuses';

import { search } from './search';
import { fetchApps } from './home';
import { fetchMyApps } from './myApps';
import { fetchInstalledApps } from './installed';

export const refresh = routeId => ((dispatch, getState) => {
  const state = getState();
  if (routeId === 'search' && state.search.get('status') !== LOADING) {
    dispatch(search());
  } if (routeId === 'installed') {
    dispatch(fetchInstalledApps());
  } else if (routeId === 'my-apps' && state.myApps.get('status') !== LOADING) {
    dispatch({ type: REMOVE_MY_APPS_RESULTS });
    dispatch(fetchMyApps());
  } else if (state.home.get('status') !== LOADING) {
    dispatch({ type: REMOVE_HOME_RESULTS });
    dispatch(fetchApps());
  }

  ipcRenderer.send('scan-installed-apps');
});
