import { combineReducers } from 'redux';

import search from './search/reducers';
import topCharts from './top-charts/reducers';

export default combineReducers({
  search,
  topCharts,
});
