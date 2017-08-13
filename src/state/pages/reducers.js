import { combineReducers } from 'redux';

import login from './log-in/reducers';
import myApps from './my-apps/reducers';
import search from './search/reducers';
import topCharts from './top-charts/reducers';

export default combineReducers({
  login,
  myApps,
  search,
  topCharts,
});
