import { combineReducers } from 'redux';

import logIn from './log-in/reducers';
import search from './search/reducers';
import topCharts from './top-charts/reducers';

export default combineReducers({
  logIn,
  search,
  topCharts,
});
