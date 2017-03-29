import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import appManagement from './appManagement';
import home from './home';
import search from './search';
import installed from './installed';
import custom from './custom';

const rootReducer = combineReducers({
  appManagement,
  home,
  search,
  installed,
  custom,
  routing: routerReducer,
});

export default rootReducer;
