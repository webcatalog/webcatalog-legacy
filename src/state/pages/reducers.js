import { combineReducers } from 'redux';

import login from './login/reducers';
import myApps from './myApps/reducers';
import search from './search/reducers';
import topCharts from './topCharts/reducers';

export default combineReducers({
  login,
  myApps,
  search,
  topCharts,
});
